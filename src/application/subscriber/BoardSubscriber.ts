import { Inject } from '@nestjs/common'

import ChangeStatusEvent, { NAME as ChangeStatusName } from '@app/domain/claim/event/ChangeStatusEvent'
import DueDateUpdatedEvent, { NAME as DueDateUpdatedName } from '@app/domain/claim/event/DueDateUpdatedEvent'
import NewMessageEvent, { NAME as NewMessageName } from '@app/domain/claim/event/NewMessageEvent'
import BoardManager, { BoardManager as BoardManagerSymbol } from '@app/infrastructure/BoardManager/BoardManager'
import EventSubscriber from '@app/infrastructure/events/EventSubscriber'

export default class BoardSubscriber implements EventSubscriber {
  public constructor(
    @Inject(BoardManagerSymbol) private readonly board: BoardManager,
  ) { }

  public subscribedEvents() {
    return [
      { key: NewMessageName, handler: this.addLabelNewMessage.bind(this) },
      { key: DueDateUpdatedName, handler: this.setDueDate.bind(this) },
      { key: ChangeStatusName, handler: this.changeStatus.bind(this) },
    ]
  }

  private addLabelNewMessage({ payload }: NewMessageEvent) {
    return this.board.addLabel('dsd', 'Новое сообщение')
  }

  private setDueDate({ payload }: DueDateUpdatedEvent) {
    if (payload.due.nonEmpty()) {
      return this.board.setDueDate('dfds', payload.due.get())
    }
  }

  private changeStatus({ payload }: ChangeStatusEvent) {
    // TODO: change status after Trello service
  }
}
