import Allocator from '../Allocator'

import MockEntityManager from '../../../__mocks__/EnitityManager'
import Claim from '../../claim/Claim.entity'
import Quota, { QuotaType } from '../Quota.entity'

describe('Accountant', () => {
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
    test('should allocate common quotas', async () => {
      const claim = new Claim('1', 'Petro')

      await allocator.allocateAuto(claim)

      expect(claim.quota.type).toBe(QuotaType.Common)
      expect(claim.quota.balance).toBe(0)
    })
  })
})
