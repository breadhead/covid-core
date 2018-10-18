import { Inject } from '@nestjs/common'

import EventSubscriber from '@app/infrastructure/events/EventSubscriber'

import Notificator, { Notificator as NotificatorSymbol } from '../notifications/Notificator'
import NewMessageEvent, { NAME } from './NewMessageEvent'

export default class NewMessageSubscriber implements EventSubscriber {
  public constructor(
    @Inject(NotificatorSymbol) private readonly notificator: Notificator,
  ) { }

  public subscribedEvents() {
    return [
      { key: NAME, handler: this.addLabelOnBoard.bind(this) },
      { key: NAME, handler: this.notify.bind(this) },
    ]
  }

  private async addLabelOnBoard({ payload }: NewMessageEvent) {
    // TODO: Added call board manager to add label for claim
    console.log('LABEL ADDED') // tslint:disable-line
  }

  private notify({ payload }: NewMessageEvent) {
    return this.notificator.newChatMessage(payload)
  }
}
