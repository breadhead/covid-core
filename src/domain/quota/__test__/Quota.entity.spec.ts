import Quota from '../Quota.entity'

import InvariantViolationException from '../../exception/InvariantViolationException'

describe('Quota', () => {
  describe('increaseBalance', () => {
    test('should increased correctly', () => {
      const q = new Quota('1', 'first', 12)

      q.increaseBalance(12)

      expect(q.balance).toBe(24)
    })
  })

  describe('decreaseBalance', () => {
    test('should decreased correctly', () => {
      const q = new Quota('2', 'second', 12)

      q.decreaseBalance(12)

      expect(q.balance).toBe(0)
    })

    test('should throw exception if balance less than diff', () => {
      const q = new Quota('2', 'second', 12)

      expect(
        () => q.decreaseBalance(13),
      ).toThrow(InvariantViolationException)
    })
  })

  describe('rename', () => {
    test('should rename quota correctly', () => {
      const q = new Quota('3', 'third', 12)

      q.rename('new name')

      expect(q.name).toBe('new name')
    })
  })
})
