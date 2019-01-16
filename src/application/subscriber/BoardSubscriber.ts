import { Inject, Injectable } from '@nestjs/common'

import ChangeStatusEvent, {
  NAME as ChangeStatusName,
} from '@app/domain/claim/event/ChangeStatusEvent'
import CreateClaimEvent, {
  NAME as CreateClaimName,
} from '@app/domain/claim/event/CreateClaimEvent'
import DueDateUpdatedEvent, {
  NAME as DueDateUpdatedName,
} from '@app/domain/claim/event/DueDateUpdatedEvent'
import NewMessageEvent, {
  NAME as NewMessageName,
} from '@app/domain/claim/event/NewMessageEvent'
import BoardManager, {
  BoardManager as BoardManagerSymbol,
} from '@app/infrastructure/BoardManager/BoardManager'
import Configuration from '@app/infrastructure/Configuration/Configuration'
import EventSubscriber from '@app/infrastructure/events/EventSubscriber'
import ClaimBoardCardFinder from '@app/domain/claim/ClaimBoardCardFinder'
import { ClaimStatus } from '@app/domain/claim/Claim.entity'

export default class BoardSubscriber implements EventSubscriber {
  public constructor(
    @Inject(BoardManagerSymbol) private readonly board: BoardManager,
    private readonly claimBoardCardFinder: ClaimBoardCardFinder,
    private readonly config: Configuration,
  ) {}

  public subscribedEvents() {
    return [
      { key: NewMessageName, handler: this.addLabelNewMessage.bind(this) },
      { key: DueDateUpdatedName, handler: this.setDueDate.bind(this) },
      { key: ChangeStatusName, handler: this.changeStatus.bind(this) },
      { key: CreateClaimName, handler: this.createClaim.bind(this) },
    ]
  }

  private addLabelNewMessage({ payload }: NewMessageEvent) {
    return this.board.addLabel('dsd', 'Новое сообщение')
  }

  private setDueDate({ payload }: DueDateUpdatedEvent) {
    return
  }

  private createClaim({ payload }: CreateClaimEvent) {
    if (payload) {
      const siteUrl = this.config
        .get('SITE_URL')
        .getOrElse('oncohelp.breadhead.ru')
      const listId = '5bab6a391071c087cc9b4e45'
      const cardTitle = 'Заявка #' + payload.id
      const trelloCardText = `[Перейти к заявке](http://${siteUrl}/manager/consultation/${
        payload.id
      })`

      return this.board.createCard(cardTitle, trelloCardText, listId)
    }
  }

  private async changeStatus({ payload }: ChangeStatusEvent) {
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

    const boardId = this.config.get('BOARD_ID').getOrElse('ppy28Io5')

    const lists = await this.board.getBoardLists(boardId)

    const listForStatus = lists.find(l =>
      l.name.includes(statusListNameTable[payload.status]),
    )

    const claimCard = await this.claimBoardCardFinder.getCardById(payload.id)

    this.board.moveCard(claimCard.id, listForStatus.id)
  }
}
