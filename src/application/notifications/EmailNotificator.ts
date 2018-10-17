import { Inject } from '@nestjs/common'

import User from '@app/domain/user/User.entity'
import EmailSender, { EmailSender as EmailSenderSymbol } from '@app/infrastructure/EmailSender/EmailSender'

import NotificationMessage from './NotificationMessage'
import Notificator from './Notificator'

export default class EmailNotificator implements Notificator {
  public constructor(
    @Inject(EmailSenderSymbol) private readonly sender: EmailSender,
  ) { }

  public notify(user: User, message: NotificationMessage): Promise<void> {
    return this.sender.send('s', 'ds', 'ds', { text: 'ds' })
  }
}
