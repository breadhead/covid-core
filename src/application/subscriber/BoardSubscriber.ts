import { Inject } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'

import { ClaimStatus, default as Claim } from '@app/domain/claim/Claim.entity'
import ClaimBoardCardFinder from '@app/domain/claim/ClaimBoardCardFinder'
import ChangeStatusEvent, {
  NAME as ChangeStatusName,
} from '@app/domain/claim/event/ChangeStatusEvent'
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
      { key: DueDateUpdatedName, handler: this.setDueDate.bind(this) },
      { key: ChangeStatusName, handler: this.changeStatus.bind(this) },
      { key: CreateClaimName, handler: this.createClaim.bind(this) },
      { key: DoctorChangedName, handler: this.doctorChanged.bind(this) },
    ]
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

  private async setDueDate({ payload }: DueDateUpdatedEvent) {
    const claimCard = await this.claimBoardCardFinder.getCardById(payload.id)

    if (payload.due.nonEmpty()) {
      return this.board.setDueDate(claimCard.id, payload.due.get())
    }
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
      })

      const [list, idLabels] = await Promise.all([
        this.getListIdForClaimStatus(ClaimStatus.QuotaAllocation),
        this.createClaimLabels(payload),
      ])

      return this.board.createCardWithExtraParams(
        cardTitle,
        { desc: trelloCardText, idLabels },
        list.id,
      )
    }
  }

  private async changeStatus({ payload }: ChangeStatusEvent) {
    if (payload.status === ClaimStatus.QuotaAllocation) {
      // Don't move card if its being created
      return
    }

    const claimCard = await this.claimBoardCardFinder.getCardById(payload.id)

    const list = await this.getListIdForClaimStatus(payload.status)

    return this.board.moveCard(claimCard.id, list.id)
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

    const labels = await Promise.all([
      this.board.createOrGetLabel(boardId, claim.applicant.region),
      this.board.createOrGetLabel(boardId, claim.applicant.gender),
      this.board.createOrGetLabel(boardId, claim.localization),
      this.board.createOrGetLabel(boardId, claim.theme),
    ])

    return labels.map(label => label.id)
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
        this.board.removeMemberFromCard(cardId, doctorOnCard.username),
      ),
    )
  }
}
