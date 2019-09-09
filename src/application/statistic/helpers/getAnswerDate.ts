import Claim from '@app/domain/claim/Claim.entity'

export const getAnswerDate = (claim: Claim) => {
  if (
    claim.answeredAt < claim.sentToDoctorAt &&
    claim.answerUpdatedAt > claim.answeredAt
  ) {
    return claim.answerUpdatedAt
  }

  return claim.answeredAt
}
