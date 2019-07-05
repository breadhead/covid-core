import NewFeedbackEvent, {
  NAME as NewFeedbackEventName,
} from '@app/domain/feedback/event/NewFeedbackEvent'
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
  BoardKind,
  BoardManager as BoardManagerSymbol,
} from '@app/infrastructure/BoardManager/BoardManager'
import { Configuration } from '@app/config/Configuration'
import EventSubscriber from '@app/infrastructure/events/EventSubscriber'

import { CorporateStatus } from '@app/domain/claim/CorporateStatus'
import ClaimEditedEvent, {
  NAME as ClaimEditedName,
} from '@app/domain/claim/event/ClaimEditedEvent'
import { getReadableCorporateStatus } from '@app/domain/claim/helpers/getReadableCorporateStatus'
import Role from '@app/domain/user/Role'
import { formatDate } from '../notifications/helpers'
import { Templating } from '@app/utils/service/Templating/Templating'

export default class BoardSubscriber implements EventSubscriber {
  public constructor(
    @Inject(BoardManagerSymbol) private readonly board: BoardManager,
    private readonly templating: Templating,
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
      {
        key: NewFeedbackEventName,
        handler: this.feedbackHandler.bind(this),
        isNew: true,
      },
    ]
  }

  private async onClaimEdited({ payload }: ClaimEditedEvent) {
    await this.fitCorporateLabels(payload)
  }

  private async addLabelNewMessage({ payload }: NewMessageEvent) {
    const claimCard = await this.claimBoardCardFinder.getCardById(
      payload.claim.id,
    )

    const author = payload.user

    const newMessageLabelText = 'Новое сообщение'

    if (author.isClient) {
      return this.board.addLabel(claimCard.id, newMessageLabelText)
    }

    return this.board.deleteLabelFromCard(claimCard.id, newMessageLabelText)
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
      50,
      BoardKind.Completed,
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

      const cardTitle = `Заявка #${payload.number}`
      const trelloCardText = await this.templating.render('trello/card', {
        siteUrl,
        id: payload.id,
        createdAt: formatDate(Option.of(new Date())),
      })

      const [[_, listId], idLabels] = await Promise.all([
        this.getListIdForClaimStatus(ClaimStatus.QuotaAllocation),
        this.createClaimLabels(payload),
      ])

      const cardId = await this.board.createCardWithExtraParams(
        cardTitle,
        { desc: trelloCardText, idLabels },
        listId,
      )

      const caseManager = await this.userRepo.findCaseManager()

      if (caseManager && caseManager.boardUsername) {
        await this.board.addMemberToCard(cardId, caseManager.boardUsername)
      }
    }
  }

  private async feedbackHandler({ payload }: NewFeedbackEvent) {
    const match = payload.theme.match(/Заявка №(\d+)/)

    if (!match) {
      return
    }

    const [_, claimNumber] = match

    if (claimNumber) {
      const card = await this.claimBoardCardFinder.getCardByNumber(
        claimNumber,
        50,
        BoardKind.Completed,
      )

      if (card) {
        const [boardId, listId] = await this.getListIdForClaimStatus(
          ClaimStatus.Feedback,
        )

        await this.board.moveCard(card.id, listId, boardId)
      }
    }
  }

  private async changeStatus({ payload }: ChangeStatusEvent) {
    const [claimCard, [boardId, listId]] = await Promise.all([
      this.claimBoardCardFinder.getCardById(payload.id),
      this.getListIdForClaimStatus(payload.status),
    ])

    await this.board.moveCard(claimCard.id, listId, boardId)
  }

  private async doctorChanged({ payload }: DoctorChangedEvent) {
    const claimCard = await this.claimBoardCardFinder.getCardById(payload.id)

    await this.removeDoctorsFromCard(claimCard.id)

    return this.board.addMemberToCard(
      claimCard.id,
      payload.doctor.boardUsername,
    )
  }

  private async getListIdForClaimStatus(
    status: ClaimStatus,
  ): Promise<[string, string]> {
    const statusListNameTable = {
      [ClaimStatus.QuotaAllocation]: [BoardKind.Current, 'Распределение квоты'],
      [ClaimStatus.QueueForQuota]: [BoardKind.Current, 'В очереди на квоту'],
      [ClaimStatus.QuestionnaireWaiting]: [
        BoardKind.Current,
        'Ожидание анкеты',
      ],
      [ClaimStatus.QuestionnaireValidation]: [
        BoardKind.Current,
        'Проверка анкеты',
      ],
      [ClaimStatus.AtTheDoctor]: [BoardKind.Current, 'В работе у врача'],
      [ClaimStatus.AnswerValidation]: [
        BoardKind.Current,
        'Проверка ответа врача',
      ],
      [ClaimStatus.DeliveredToCustomer]: [
        BoardKind.Current,
        'Передано заказчику',
      ],
      [ClaimStatus.ClosedWithoutAnswer]: [
        BoardKind.Current,
        'Не требует ответа эксперта',
      ],

      [ClaimStatus.Denied]: [BoardKind.Rejected, 'Отказ'],

      [ClaimStatus.ClosedSuccessfully]: [BoardKind.Completed, 'Успешно'],
      [ClaimStatus.Feedback]: [BoardKind.Completed, 'Жалоба'],
    }

    const [boardKind, listName] = statusListNameTable[status]

    const boardId = this.board.getBoardIdByKind(boardKind)

    const lists = await this.board.getBoardLists(boardId)

    const listId = lists.find(l => l.name.includes(listName)).id

    return [boardId, listId]
  }

  private async createClaimLabels(claim: Claim): Promise<string[]> {
    const boardId = this.board.getBoardIdByKind(BoardKind.Current)

    const propertiesToLabel = [
      claim.applicant.region,
      claim.applicant.gender,
      claim.localization,
      claim.theme,
      ...Object.values(CorporateStatus).map(getReadableCorporateStatus),
    ].filter(property => !!property)

    const labels = await Promise.all(
      propertiesToLabel.map(property =>
        this.board.createOrGetLabel(boardId, property),
      ),
    )

    return labels.map(label => label.id)
  }

  private async fitCorporateLabels(claim: Claim) {
    const allLabelValues = Object.values(CorporateStatus).map(
      getReadableCorporateStatus,
    )

    const card = await this.claimBoardCardFinder.getCardById(claim.id)

    await Promise.all(
      allLabelValues.map(label =>
        this.board.deleteLabelFromCard(card.id, label),
      ),
    )

    const labelText = getReadableCorporateStatus(claim.corporateStatus)

    if (labelText.length > 0) {
      await this.board
        .addLabel(card.id, getReadableCorporateStatus(claim.corporateStatus))
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
