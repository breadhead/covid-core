import Message from '@app/domain/claim/Message.entity'
import Feedback from '@app/domain/feedback/Feedback.entity'

export default interface Notificator {
  newChatMessage(message: Message): Promise<void>
  newFeedbackMessage(message: Feedback): Promise<void>
}

const Notificator = Symbol('Notificator')

export {
  Notificator,
}
