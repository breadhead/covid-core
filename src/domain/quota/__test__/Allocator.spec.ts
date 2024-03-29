import Allocator from '../Allocator'

import MockEntityManager from '../../../__mocks__/EnitityManager'
import Gender from '../../../infrastructure/customTypes/Gender'
import Applicant from '../../claim/Applicant.vo'
import Claim from '../../claim/Claim.entity'
import Quota from '../Quota.entity'
import { User } from '@app/user/model/User.entity'

describe('Allocator', () => {
  let applicant: Applicant
  let user: User
  let allocator: Allocator

  beforeAll(() => {
    applicant = new Applicant('Petr', 12, Gender.unknown, 'Tomsk')
    user = new User('login')
  })

  beforeEach(() => {
    const quota = new Quota('1', 'name')
    quota.increaseBalance(1)

    allocator = new Allocator(
      new MockEntityManager() as any,
      { findCommon: () => Promise.resolve([quota]) } as any,
    )
  })

  // describe('allocateAuto', () => {
  //   test('should allocate common quota', async () => {
  //     const claim = createMockClaim()

  //     await allocator.allocateAuto(claim)

  //     expect(claim.quota.type).toBe(QuotaType.Common)
  //     expect(claim.quota.balance).toBe(0)
  //   })

  //   test('should throw exception if no common quota found', async () => {
  //     const claim = createMockClaim()

  //     // spent all quotas
  //     await allocator.allocateAuto(
  //       new Claim('2', 2, new Date(), applicant, user, 'theme'),
  //     )

  //     await expect(allocator.allocateAuto(claim)).rejects.toThrow(
  //       QuotaAllocationFailedException,
  //     )
  //   })
  // })

  // describe('allocate', () => {
  //   test('shloud allocate quota', async () => {
  //     const claim = createMockClaim()

  //     const quota = new Quota('1', 'quota')
  //     quota.increaseBalance(1)

  //     await allocator.allocate(claim, quota)

  //     expect(claim.quota.id).toBe('1')
  //     expect(claim.quota.name).toBe('quota')
  //     expect(claim.quota.balance).toBe(0)
  //   })

  //   test('should throw exception if try to allocate empty quota', async () => {
  //     const claim = createMockClaim()

  //     const quota = new Quota('1', 'quota')

  //     await expect(allocator.allocate(claim, quota)).rejects.toThrow(
  //       QuotaAllocationFailedException,
  //     )
  //   })
  // })

  const createMockClaim = () =>
    new Claim('1', 1, new Date(), new Date(), applicant, user, 'theme')

  describe('deallocate', () => {
    test('shloud deallocate quota without restore', async () => {
      const claim = createMockClaim()

      const quota = new Quota('1', 'quota')
      quota.increaseBalance(1)

      await allocator.allocate(claim, quota)

      await allocator.deallocate(claim)

      expect(claim.quota).toBeNull()
      expect(quota.balance).toBe(0)
    })

    test('shloud deallocate quota with restore', async () => {
      const claim = createMockClaim()

      const quota = new Quota('1', 'quota')
      quota.increaseBalance(1)

      await allocator.allocate(claim, quota)

      await allocator.deallocate(claim, true)

      expect(claim.quota).toBeNull()
      expect(quota.balance).toBe(1)
    })
  })
})
