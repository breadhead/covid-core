import { Inject } from '@nestjs/common'

import ClaimRejectedEvent, { NAME } from '@app/domain/claim/event/ClaimRejectedEvent'
import EventSubscriber from '@app/infrastructure/events/EventSubscriber'

import Notificator, { Notificator as NotificatorSymbol } from '../../notifications/Notificator'

export default class ClaimRejectedSubscriber implements EventSubscriber {
  public constructor(
    @Inject(NotificatorSymbol) private readonly notificator: Notificator,
  ) { }

  public subscribedEvents() {
    return [
      { key: NAME, handler: this.notify.bind(this) },
    ]
  }
  private notify({ payload }: ClaimRejectedEvent) {
    return this.notificator.claimRejected(payload)
  }
}
