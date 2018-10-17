import User from '@app/domain/user/User.entity'

import NotificationMessage from './NotificationMessage'
import Notificator from './Notificator'

export default class EmailNotificator implements Notificator {
  public async sendNotification(user: User, message: NotificationMessage): Promise<void> {
    console.log(message)
  }
}
