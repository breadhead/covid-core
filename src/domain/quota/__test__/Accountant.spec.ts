import Accountant from '../Accountant'

import MockEntityManager from '../../../__mocks__/EnitityManager'
import Quota from '../Quota.entity'

describe('Accountant', () => {
  let accountant: Accountant

  beforeAll(() => {
    accountant = new Accountant(new MockEntityManager() as any)
  })

  describe('transfer', () => {
    test('should change balances correct', async () => {
      const source = new Quota('1', 'firse', 12)
      const target = new Quota('2', 'second', 12)

      await accountant.tranfser(source, target, 12)

      expect(source.balance).toBe(0)
      expect(target.balance).toBe(24)
    })
  })
})
