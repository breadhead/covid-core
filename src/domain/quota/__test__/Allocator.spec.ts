import Allocator from '../Allocator'

import MockEntityManager from '../../../__mocks__/EnitityManager'
import Claim from '../../claim/Claim.entity'
import Quota, { QuotaType } from '../Quota.entity'

describe('Allocator', () => {
  let allocator: Allocator

  beforeAll(() => {
    const quota = new Quota('1', 'name')
    quota.increaseBalance(1)

    allocator = new Allocator(
      new MockEntityManager() as any,
      { findCommon: () => Promise.resolve([quota]) } as any,
    )
  })

  describe('allocateAuto', () => {
    test('should allocate common quota', async () => {
      const claim = new Claim('1', 'Petro')

      await allocator.allocateAuto(claim)

      expect(claim.quota.type).toBe(QuotaType.Common)
      expect(claim.quota.balance).toBe(0)
    })
  })

  describe('allocate', () => {
    test('shloud allocate quota', async () => {
      const claim = new Claim('1', 'Petro')

      const quota = new Quota('1', 'quota')
      quota.increaseBalance(1)

      await allocator.allocate(claim, quota)

      expect(claim.quota.id).toBe('1')
      expect(claim.quota.name).toBe('quota')
      expect(claim.quota.balance).toBe(0)
    })
  })
})
