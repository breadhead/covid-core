import { Inject } from '@nestjs/common'

import EventSubscriber from '@app/infrastructure/events/EventSubscriber'

import Notificator, { Notificator as NotificatorSymbol } from '../notifications/Notificator'
import ShortClaimQueuedEvent, { NAME } from './ShortClaimQueuedEvent'

export default class ShortClaimQueuedSubscriber implements EventSubscriber {
  public constructor(
    @Inject(NotificatorSymbol) private readonly notificator: Notificator,
  ) { }

  public subscribedEvents() {
    return [
      { key: NAME, handler: this.notify.bind(this) },
    ]
  }
  private notify({ payload }: ShortClaimQueuedEvent) {
    return this.notificator.shortClaimQueued(payload)
  }
}
