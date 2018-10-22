import InvariantViolationException from '../../exception/InvariantViolationException'
import Quota from '../../quota/Quota.entity'
import Claim from '../Claim.entity'

describe('Claim', () => {
  describe('bindQuota', () => {
    test('should bind quota correctly', () => {
      const c = new Claim('1', 'Petro')
      const q = new Quota('1', 'quota first')

      c.bindQuota(q)

      expect(c.quota.id).toBe(q.id)
      expect(c.quota.name).toBe(q.name)
    })

    test('should throw exception if quota already binded', () => {
      const c = new Claim('1', 'Petro')
      const oldQ = new Quota('1', 'quota first')
      const newQ = new Quota('2', 'quota second')

      c.bindQuota(oldQ)

      expect(
        () => c.bindQuota(newQ),
      ).toThrow(InvariantViolationException)
    })
  })

  describe('unbindQuota', () => {
    test('should unbind quota correctly', () => {
      const c = new Claim('1', 'Petro')
      const q = new Quota('1', 'quota first')

      c.bindQuota(q)

      c.unbindQuota()

      expect(c.quota).toBeNull()
    })

    test('should throw excaption ig try to unbind empty quota', () => {
      const c = new Claim('1', 'Petro')

      expect(
        () => c.unbindQuota(),
      ).toThrow(InvariantViolationException)
    })
  })
})
