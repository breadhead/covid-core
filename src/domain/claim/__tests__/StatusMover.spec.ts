import StatusMover from '../StatusMover'

import MockEntityManager from '../../../__mocks__/EnitityManager'
import Gender from '../../../infrastructure/customTypes/Gender'
import Quota from '../../quota/Quota.entity'
import User from '../../user/User.entity'
import Applicant from '../Applicant.vo'
import Claim, { ClaimStatus } from '../Claim.entity'

describe('StatusMover', () => {
  let applicant: Applicant
  let user: User
  let statusMover: StatusMover

  beforeAll(() => {
    applicant = new Applicant('Petr', 12, Gender.unknown, 'Tomsk')
    user = new User('login')

    statusMover = new StatusMover(
      new MockEntityManager() as any,
    )
  })

  describe('deny', () => {
    test('should change status to denied from any status', async () => {
      const claim = new Claim('1', applicant, user, 'theme')

      const statuses = Object
        .keys(ClaimStatus)
        .map((key) => ClaimStatus[key])

      for (const status of statuses) {
        claim.changeStatus(status)

        await statusMover.deny(claim)

        expect(claim.status).toBe(ClaimStatus.Denied)
      }
    })
  })

  describe('next', () => {
    test('should move from New to QuotaAllocation claim without quota', async () => {
      const claim = new Claim('1', applicant, user, 'theme')
      claim.changeStatus(ClaimStatus.New)

      await statusMover.next(claim)

      expect(claim.status).toBe(ClaimStatus.QuotaAllocation)
    })

    test('should move from New to QuestionnaireWaiting claim with quota', async () => {
      const claim = new Claim('1', applicant, user, 'theme')
      claim.bindQuota(new Quota('1', 'first'))
      claim.changeStatus(ClaimStatus.New)

      await statusMover.next(claim)

      expect(claim.status).toBe(ClaimStatus.QuestionnaireWaiting)
    })

    test('should move from QuotaAllocation to QueueForQuota claim without quota', async () => {
      const claim = new Claim('1', applicant, user, 'theme')
      claim.changeStatus(ClaimStatus.QuotaAllocation)

      await statusMover.next(claim)

      expect(claim.status).toBe(ClaimStatus.QueueForQuota)
    })

    test('should move from QuotaAllocation to QuestionnaireWaiting claim with quota', async () => {
      const claim = new Claim('1', applicant, user, 'theme')
      claim.bindQuota(new Quota('1', 'first'))
      claim.changeStatus(ClaimStatus.QuotaAllocation)

      await statusMover.next(claim)

      expect(claim.status).toBe(ClaimStatus.QuestionnaireWaiting)
    })
  })
})
