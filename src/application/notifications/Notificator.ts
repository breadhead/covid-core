import Message from '@app/domain/claim/Message.entity'
import Feedback from '@app/domain/feedback/Feedback.entity'
import Claim from 'domain/claim/Claim.entity'

export default interface Notificator {
  newChatMessage(message: Message): Promise<void>
  newFeedbackMessage(message: Feedback): Promise<void>
  newShortClaimApproved(claim: Claim): Promise<void>
}

const Notificator = Symbol('Notificator')

export {
  Notificator,
}
