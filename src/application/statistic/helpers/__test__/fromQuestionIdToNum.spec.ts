import { fromQuestionIdToNum } from '../fromQuestionIdToNum'
import Claim from '@app/domain/claim/Claim.entity'

describe('fromQuestionIdToNum', () => {
  test('should return 1 for Q1', () => {
    const res = fromQuestionIdToNum('Q1')
    expect(res).toBe(1)
  })
})
