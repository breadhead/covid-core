import User from '@app/domain/user/User.entity'

import NotificationMessage from './NotificationMessage'

export default interface Notificator {
  sendNotification(user: User, message: NotificationMessage): Promise<void>
}

const Notificator = Symbol('Notificator')

export {
  Notificator,
}
