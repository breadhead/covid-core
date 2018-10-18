import Message from '@app/domain/claim/Message.entity'

export default interface Notificator {
  newChatMessage(message: Message): Promise<void>
}

const Notificator = Symbol('Notificator')

export {
  Notificator,
}
