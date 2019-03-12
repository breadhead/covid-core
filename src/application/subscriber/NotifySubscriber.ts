import { Inject } from '@nestjs/common'

import ClaimApprovedEvent, {
  NAME as ClaimApprovedName,
} from '@app/domain/claim/event/ClaimApprovedEvent'
import ClaimRejectedEvent, {
  NAME as ClaimRejectedName,
} from '@app/domain/claim/event/ClaimRejectedEvent'
import DoctorAnswerEvent, {
  NAME as DoctorAnswerName,
} from '@app/domain/claim/event/DoctorAnswerEvent'
import ShortClaimQueuedEvent, {
  NAME as ShortClaimQueuedName,
} from '@app/domain/claim/event/ShortClaimQueuedEvent'
import NewFeedbackEvent, {
  NAME as NewFeedbackName,
} from '@app/domain/feedback/event/NewFeedbackEvent'
import EventSubscriber from '@app/infrastructure/events/EventSubscriber'

import Notificator, {
  Notificator as NotificatorSymbol,
} from '../notifications/Notificator'

export default class NotifySubscriber implements EventSubscriber {
  public constructor(
    @Inject(NotificatorSymbol) private readonly notificator: Notificator,
  ) {}

  public subscribedEvents() {
    return [
      {
        key: ClaimApprovedName,
        handler: this.onClaimApproved.bind(this),
        isNew: true,
      },
      {
        key: ShortClaimQueuedName,
        handler: this.onShortClaimQueued.bind(this),
      },
      { key: DoctorAnswerName, handler: this.onDoctorAnswer.bind(this) },
      { key: ClaimRejectedName, handler: this.onClaimRejected.bind(this) },
      { key: NewFeedbackName, handler: this.onNewFeedback.bind(this) },
    ]
  }

  private async onClaimApproved({ payload }: ClaimApprovedEvent) {
    await this.notificator.claimApproved(payload)
  }

  private onShortClaimQueued({ payload }: ShortClaimQueuedEvent) {
    return this.notificator.shortClaimQueued(payload)
  }

  private onDoctorAnswer({ payload }: DoctorAnswerEvent) {
    return this.notificator.doctorAnswer(payload)
  }

  private onClaimRejected({ payload }: ClaimRejectedEvent) {
    return this.notificator.claimRejected(payload)
  }

  private onNewFeedback({ payload }: NewFeedbackEvent) {
    this.notificator.newFeedbackMessage(payload)
  }
}
