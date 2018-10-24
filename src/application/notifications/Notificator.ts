import Claim from '@app/domain/claim/Claim.entity'
import Message from '@app/domain/claim/Message.entity'
import Feedback from '@app/domain/feedback/Feedback.entity'

export default interface Notificator {
  newChatMessageToClient(message: Message): Promise<void>
  newChatMessageToSpecialist(message: Message): Promise<void>
  newFeedbackMessage(feedback: Feedback): Promise<void>
  shortClaimApproved(claim: Claim): Promise<void>
  shortClaimQueued(claim: Claim): Promise<void>
  claimRejected(claim: Claim): Promise<void>
  doctorAnswer(answer: Claim): Promise<void>
}

const Notificator = Symbol('Notificator')

export {
  Notificator,
}
