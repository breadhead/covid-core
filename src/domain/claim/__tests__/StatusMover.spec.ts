import * as moment from 'moment'

import StatusMover from '../StatusMover'

import MockConfiguration from '../../../__mocks__/Configuration'
import MockEntityManager from '../../../__mocks__/EnitityManager'
import MockEventEmitter from '../../../__mocks__/EventEmitter'
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
      new MockEventEmitter() as any,
      new MockConfiguration({
        DUARTION_QUESTIONNAIRE_WAITING: '2d',
        DURATION_AT_THE_DOCTOR: '3d',
        DURATION_DELIVERED_TO_CUSTOMER: '4d',
      }),
    )
  })

  describe('deny', () => {
    test('should change status to denied from any status', async () => {
      const claim = new Claim('1', applicant, user, 'theme')

      const statuses = Object.keys(ClaimStatus).map(key => ClaimStatus[key])

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

    test('should move from QuestionnaireWaiting to QuestionnaireValidation claim', async () => {
      const claim = new Claim('1', applicant, user, 'theme')
      claim.changeStatus(ClaimStatus.QuestionnaireWaiting)

      await statusMover.next(claim)

      expect(claim.status).toBe(ClaimStatus.QuestionnaireValidation)
    })

    test('should move from QuestionnaireValidation to AtTheDoctor claim', async () => {
      const claim = new Claim('1', applicant, user, 'theme')
      claim.changeStatus(ClaimStatus.QuestionnaireValidation)

      await statusMover.next(claim)

      expect(claim.status).toBe(ClaimStatus.AtTheDoctor)
    })

    test('should move from AtTheDoctor to AnswerValidation claim', async () => {
      const claim = new Claim('1', applicant, user, 'theme')
      claim.changeStatus(ClaimStatus.AtTheDoctor)

      await statusMover.next(claim)

      expect(claim.status).toBe(ClaimStatus.AnswerValidation)
    })

    test('should move from AnswerValidation to DeliveredToCustomer claim', async () => {
      const claim = new Claim('1', applicant, user, 'theme')
      claim.changeStatus(ClaimStatus.AnswerValidation)

      await statusMover.next(claim)

      expect(claim.status).toBe(ClaimStatus.DeliveredToCustomer)
    })

    test('should move from DeliveredToCustomer to ClosedSuccessfully claim', async () => {
      const claim = new Claim('1', applicant, user, 'theme')
      claim.changeStatus(ClaimStatus.DeliveredToCustomer)

      await statusMover.next(claim)

      expect(claim.status).toBe(ClaimStatus.ClosedSuccessfully)
    })

    test('should add due date for QuestionnaireWaiting', async () => {
      const claim = new Claim('1', applicant, user, 'theme')
      claim.changeStatus(ClaimStatus.New)
      claim.bindQuota(new Quota('1', 'first'))

      await statusMover.next(claim)

      expect(claim.due.nonEmpty()).toBeTruthy()
      if (claim.due.nonEmpty()) {
        expect(moment(claim.due.get()).toNow()).toBe('2 days ago')
      }
    })

    test('should add due date for AtTheDoctor', async () => {
      const claim = new Claim('1', applicant, user, 'theme')
      claim.changeStatus(ClaimStatus.QuestionnaireValidation)

      await statusMover.next(claim)

      expect(claim.due.nonEmpty()).toBeTruthy()
      if (claim.due.nonEmpty()) {
        expect(moment(claim.due.get()).toNow()).toBe('3 days ago')
      }
    })

    test('should add due date for DeliveredToCustomer', async () => {
      const claim = new Claim('1', applicant, user, 'theme')
      claim.changeStatus(ClaimStatus.AnswerValidation)

      await statusMover.next(claim)

      expect(claim.due.nonEmpty()).toBeTruthy()
      if (claim.due.nonEmpty()) {
        expect(moment(claim.due.get()).toNow()).toBe('4 days ago')
      }
    })
  })
})
