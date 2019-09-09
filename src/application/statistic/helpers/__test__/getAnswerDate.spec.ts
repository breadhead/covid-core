import { getAnswerDate } from '../getAnswerDate'
import Claim from '@app/domain/claim/Claim.entity'

describe('getAnswerDate', () => {
  test('should works', () => {
    const mockClaim = {
      sentToDoctorAt: new Date('2019-07-10 10:33:30'),
      answeredAt: new Date('2019-07-09 20:56:31'),
      answerUpdatedAt: new Date('2019-07-15 14:01:21'),
    }
    const date = getAnswerDate(mockClaim as Claim)

    expect(date).toBe(mockClaim.answerUpdatedAt)
  })

  test('should works', () => {
    const mockClaim = {
      sentToDoctorAt: new Date('2019-07-5 10:33:30'),
      answeredAt: new Date('2019-07-09 20:56:31'),
      answerUpdatedAt: new Date('2019-07-15 14:01:21'),
    }
    const date = getAnswerDate(mockClaim as Claim)

    expect(date).toBe(mockClaim.answeredAt)
  })
})
