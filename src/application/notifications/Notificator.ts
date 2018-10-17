import Message from '@app/domain/claim/Message.entity'
import User from '@app/domain/user/User.entity'

export default interface Notificator {
  newMessage(user: User, message: Message): Promise<void>
}

const Notificator = Symbol('Notificator')

export {
  Notificator,
}
