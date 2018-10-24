import { Inject } from '@nestjs/common'

import EventSubscriber from '@app/infrastructure/events/EventSubscriber'

import Notificator, { Notificator as NotificatorSymbol } from '../notifications/Notificator'
import DoctorAnswerEvent, { NAME } from './DoctorAnswerEvent'

export default class DoctorAnswerSubscriber implements EventSubscriber {
  public constructor(
    @Inject(NotificatorSymbol) private readonly notificator: Notificator,
  ) { }

  public subscribedEvents() {
    return [
      { key: NAME, handler: this.notify.bind(this) },
    ]
  }
  private notify({ payload }: DoctorAnswerEvent) {
    return this.notificator.doctorAnswer(payload)
  }
}
