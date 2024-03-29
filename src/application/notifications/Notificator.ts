import Claim from '@app/domain/claim/Claim.entity'
import Message from '@app/domain/claim/Message.entity'
import Feedback from '@app/domain/feedback/Feedback.entity'

export default interface Notificator {
  newChatMessageFromClient(message: Message): Promise<void>
  newChatMessageFromSpecialist(message: Message): Promise<void>
  newFeedbackMessage(feedback: Feedback): Promise<void>
  claimApproved(claim: Claim): Promise<void>
  claimRequiresWaiting(claim: Claim): Promise<void>
  shortClaimQueued(claim: Claim): Promise<void>
  claimRejected(claim: Claim): Promise<void>
  doctorAnswer(answer: Claim): Promise<void>
  claimSendToDoctor(claim: Claim): Promise<void>
  feedbackAnswerSent(claim: Claim): Promise<void>
  closeWithoutAnswer(payload: Claim): Promise<void>
  claimAlmostOverdue(claim: Claim): Promise<void>
}

const Notificator = Symbol('Notificator')

export { Notificator }
