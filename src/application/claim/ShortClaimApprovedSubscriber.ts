import { Inject } from '@nestjs/common'

import EventSubscriber from '@app/infrastructure/events/EventSubscriber'

import Notificator, { Notificator as NotificatorSymbol } from '../notifications/Notificator'
import newShortClaimApprovedEvent, { NAME } from './ShortClaimApprovedEvent'

export default class ShortClaimApprovedSubscriber implements EventSubscriber {
  public constructor(
    @Inject(NotificatorSymbol) private readonly notificator: Notificator,
  ) { }

  public subscribedEvents() {
    return [
      { key: NAME, handler: this.notify.bind(this) },
    ]
  }

  private notify({ payload }: newShortClaimApprovedEvent) {
    return this.notificator.newShortClaimApprovedEvent(payload)
  }
}
