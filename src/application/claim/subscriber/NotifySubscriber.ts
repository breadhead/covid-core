import { Inject } from '@nestjs/common'

import NewMessageEvent, { NAME as NewMessageName } from '@app/domain/claim/event/NewMessageEvent'
import ShortClaimApprovedEvent, {
  NAME as ShortClaimApprovedName,
} from '@app/domain/claim/event/ShortClaimApprovedEvent'
import ShortClaimQueuedEvent, { NAME as ShortClaimQueuedName } from '@app/domain/claim/event/ShortClaimQueuedEvent'
import EventSubscriber from '@app/infrastructure/events/EventSubscriber'

import Notificator, { Notificator as NotificatorSymbol } from '../../notifications/Notificator'

export default class NotifySubscriber implements EventSubscriber {
  public constructor(
    @Inject(NotificatorSymbol) private readonly notificator: Notificator,
  ) { }

  public subscribedEvents() {
    return [
      { key: NewMessageName, handler: this.onNewMessage.bind(this) },
      { key: ShortClaimApprovedName, handler: this.onShortClaimApproved.bind(this) },
      { key: ShortClaimQueuedName, handler: this.onShortClaimQueued.bind(this) },
    ]
  }

  private onNewMessage({ payload }: NewMessageEvent) {
    const { user } = payload

    return user.isClient
      ? this.notificator.newChatMessageFromClient(payload)
      : this.notificator.newChatMessageFromSpecialist(payload)
  }

  private onShortClaimApproved({ payload }: ShortClaimApprovedEvent) {
    return this.notificator.shortClaimApproved(payload)
  }

  private onShortClaimQueued({ payload }: ShortClaimQueuedEvent) {
    return this.notificator.shortClaimQueued(payload)
  }
}
