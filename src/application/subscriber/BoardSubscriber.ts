import { Inject } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Option } from 'tsoption'

import { ClaimStatus, default as Claim } from '@app/domain/claim/Claim.entity'
import ClaimBoardCardFinder from '@app/domain/claim/ClaimBoardCardFinder'
import AddAuthorLabelEvent, {
  NAME as AddAuthorLabelName,
} from '@app/domain/claim/event/AddAuthorLabelEvent'
import ChangeStatusEvent, {
  NAME as ChangeStatusName,
} from '@app/domain/claim/event/ChangeStatusEvent'
import CloseWithoutAnswerEvent, {
  NAME as CloseWithoutAnswerName,
} from '@app/domain/claim/event/CloseWithoutAnswerEvent'
import CreateClaimEvent, {
  NAME as CreateClaimName,
} from '@app/domain/claim/event/CreateClaimEvent'
import DoctorChangedEvent, {
  NAME as DoctorChangedName,
} from '@app/domain/claim/event/DoctorChangesEvent'
import DueDateUpdatedEvent, {
  NAME as DueDateUpdatedName,
} from '@app/domain/claim/event/DueDateUpdatedEvent'
import NewMessageEvent, {
  NAME as NewMessageName,
} from '@app/domain/claim/event/NewMessageEvent'
import UserRepository from '@app/domain/user/UserRepository'
import BoardManager, {
  BoardManager as BoardManagerSymbol,
  List,
} from '@app/infrastructure/BoardManager/BoardManager'
import Configuration from '@app/infrastructure/Configuration/Configuration'
import EventSubscriber from '@app/infrastructure/events/EventSubscriber'
import TemplateEngine, {
  TemplateEngine as TemplateEngineSymbol,
} from '@app/infrastructure/TemplateEngine/TemplateEngine'

import { CorporateStatus } from '@app/domain/claim/CorporateStatus'
import ClaimEditedEvent, {
  NAME as ClaimEditedName,
} from '@app/domain/claim/event/ClaimEditedEvent'
import { getReadbleCorporateStatus } from '@app/domain/claim/helpers/getReadableCorporateStaus'
import Role from '@app/domain/user/Role'
import { formatDate } from '../notifications/helpers'

export default class BoardSubscriber implements EventSubscriber {
  public constructor(
    @Inject(BoardManagerSymbol) private readonly board: BoardManager,
    @Inject(TemplateEngineSymbol) private readonly templating: TemplateEngine,
    @InjectRepository(UserRepository) private readonly userRepo: UserRepository,
    private readonly claimBoardCardFinder: ClaimBoardCardFinder,
    private readonly config: Configuration,
  ) {}

  public subscribedEvents() {
    return [
      { key: NewMessageName, handler: this.addLabelNewMessage.bind(this) },
      {
        key: CloseWithoutAnswerName,
        handler: this.addLabelCloseWithoutAnswer.bind(this),
      },
      {
        key: AddAuthorLabelName,
        handler: this.addAuthorLabel.bind(this),
      },
      { key: DueDateUpdatedName, handler: this.setDueDate.bind(this) },
      {
        key: ChangeStatusName,
        handler: this.changeStatus.bind(this),
        isNew: true,
      },
      {
        key: CreateClaimName,
        handler: this.createClaim.bind(this),
        isNew: true,
      },
      { key: DoctorChangedName, handler: this.doctorChanged.bind(this) },
      {
        key: ClaimEditedName,
        handler: this.onClaimEdited.bind(this),
        isNew: true,
      },
    ]
  }

  private async onClaimEdited({ payload }: ClaimEditedEvent) {
    await this.fitCorporateLables(payload)
  }

  private async addLabelNewMessage({ payload }: NewMessageEvent) {
    const claimCard = await this.claimBoardCardFinder.getCardById(
      payload.claim.id,
    )

    const author = payload.user

    const newMessageLabelText = 'Новое сообщение'

    if (author.isClient) {
      return this.board.addLabel(claimCard.id, newMessageLabelText)
    } else {
      return this.board.deleteLabelFromCard(claimCard.id, newMessageLabelText)
    }
  }

  private async addLabelCloseWithoutAnswer({
    payload,
  }: CloseWithoutAnswerEvent) {
    const claimCard = await this.claimBoardCardFinder.getCardById(payload.id)
    const text = 'Без эксперта'
    return this.board.addLabel(claimCard.id, text)
  }

  private async addAuthorLabel({ payload }: AddAuthorLabelEvent) {
    const claimCard = await this.claimBoardCardFinder.getCardById(
      payload.claim.id,
    )
    let text = 'Закрыта'
    if (payload.author === Role.CaseManager) {
      text = 'Закрыта менеджером'
    } else if (payload.author === Role.Client) {
      text = 'Закрыта заказчиком'
    }

    return this.board.addLabel(claimCard.id, text)
  }

  private async setDueDate({ payload }: DueDateUpdatedEvent) {
    const claimCard = await this.claimBoardCardFinder.getCardById(payload.id)

    await this.board.setDueDate(claimCard.id, payload.due.getOrElse(null))
  }

  private async createClaim({ payload }: CreateClaimEvent) {
    if (payload) {
      const siteUrl = this.config
        .get('SITE_URL')
        .getOrElse('oncohelp.breadhead.ru')

      const cardTitle = 'Заявка #' + payload.number
      const trelloCardText = await this.templating.render('trello/card', {
        siteUrl,
        id: payload.id,
        createdAt: formatDate(Option.of(new Date())),
      })

      const [list, idLabels] = await Promise.all([
        this.getListIdForClaimStatus(ClaimStatus.QuotaAllocation),
        this.createClaimLabels(payload),
      ])

      const cardId = await this.board.createCardWithExtraParams(
        cardTitle,
        { desc: trelloCardText, idLabels },
        list.id,
      )

      const caseManager = await this.userRepo.findCaseManager()

      if (caseManager && caseManager.boardUsername) {
        await this.board.addMemberToCard(cardId, caseManager.boardUsername)
      }
    }
  }

  private async changeStatus({ payload }: ChangeStatusEvent) {
    const [claimCard, list] = await Promise.all([
      this.claimBoardCardFinder.getCardById(payload.id),
      this.getListIdForClaimStatus(payload.status),
    ])

    await this.board.moveCard(claimCard.id, list.id)
  }

  private async doctorChanged({ payload }: DoctorChangedEvent) {
    const claimCard = await this.claimBoardCardFinder.getCardById(payload.id)

    await this.removeDoctorsFromCard(claimCard.id)

    return this.board.addMemberToCard(
      claimCard.id,
      payload.doctor.boardUsername,
    )
  }

  private async getListIdForClaimStatus(status: ClaimStatus): Promise<List> {
    const statusListNameTable = {
      [ClaimStatus.QuotaAllocation]: 'Распределение квоты',
      [ClaimStatus.QueueForQuota]: 'В очереди на квоту',
      [ClaimStatus.QuestionnaireWaiting]: 'Ожидание анкеты',
      [ClaimStatus.QuestionnaireValidation]: 'Проверка анкеты',
      [ClaimStatus.AtTheDoctor]: 'В работе у врача',
      [ClaimStatus.AnswerValidation]: 'Проверка ответа врача',
      [ClaimStatus.DeliveredToCustomer]: 'Передано заказчику',
      [ClaimStatus.ClosedSuccessfully]: 'Успешно',
      [ClaimStatus.Denied]: 'Отказ',
      [ClaimStatus.ClosedWithoutAnswer]: 'Не требует ответа эксперта',
    }

    const boardId = this.config
      .get('BOARD_ID')
      .getOrElse('5baa59a6648f9b2166d65935')

    const lists = await this.board.getBoardLists(boardId)

    return lists.find(l => l.name.includes(statusListNameTable[status]))
  }

  private async createClaimLabels(claim: Claim): Promise<string[]> {
    const boardId = this.config
      .get('BOARD_ID')
      .getOrElse('5baa59a6648f9b2166d65935')

    const propertiesToLabel = [
      claim.applicant.region,
      claim.applicant.gender,
      claim.localization,
      claim.theme,
      ...Object.values(CorporateStatus).map(getReadbleCorporateStatus),
    ].filter(property => !!property)

    const labels = await Promise.all(
      propertiesToLabel.map(property =>
        this.board.createOrGetLabel(boardId, property),
      ),
    )

    return labels.map(label => label.id)
  }

  private async fitCorporateLables(claim: Claim) {
    const allLabelValues = Object.values(CorporateStatus).map(
      getReadbleCorporateStatus,
    )

    const card = await this.claimBoardCardFinder.getCardById(claim.id)

    await Promise.all(
      allLabelValues.map(label =>
        this.board.deleteLabelFromCard(card.id, label),
      ),
    )

    const labelText = getReadbleCorporateStatus(claim.corporateStatus)

    if (labelText.length > 0) {
      await this.board
        .addLabel(card.id, getReadbleCorporateStatus(claim.corporateStatus))
        .catch(() => {
          // okay...
        })
    }
  }

  private async removeDoctorsFromCard(cardId: string): Promise<void> {
    const [doctors, members] = await Promise.all([
      this.userRepo.findDoctors(),
      this.board.getCardMembers(cardId),
    ])

    const doctorBoardUsernames = doctors.map(doctor => doctor.boardUsername)
    const doctorsOnCard = members.filter(member =>
      doctorBoardUsernames.includes(member.username),
    )

    await Promise.all(
      doctorsOnCard.map(doctorOnCard =>
        this.board.removeMemberFromCardByUsername(
          cardId,
          doctorOnCard.username,
        ),
      ),
    )
  }
}
