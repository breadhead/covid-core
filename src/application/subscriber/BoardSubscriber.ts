import { Inject } from '@nestjs/common'

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
    ]
  }

  private async addLabelNewMessage({ payload }: NewMessageEvent) {
    return this.board.addLabel('dsd', 'Новое сообщение')
  }
}
