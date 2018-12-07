import Quota from '../Quota.entity'

import InvariantViolationException from '../../exception/InvariantViolationException'

describe('Quota', () => {
  describe('increaseBalance', () => {
    test('should increased correctly', () => {
      const q = new Quota('1', 'first')

      q.increaseBalance(12)

      expect(q.balance).toBe(12)
    })
  })

  describe('decreaseBalance', () => {
    test('should decreased correctly', () => {
      const q = new Quota('2', 'second')
      q.increaseBalance(12)

      q.decreaseBalance(12)

      expect(q.balance).toBe(0)
    })

    test('should throw exception if balance less than diff', () => {
      const q = new Quota('2', 'second')
      q.increaseBalance(12)

      expect(() => q.decreaseBalance(13)).toThrow(InvariantViolationException)
    })
  })

  describe('rename', () => {
    test('should rename quota correctly', () => {
      const q = new Quota('3', 'third')

      q.rename('new name')

      expect(q.name).toBe('new name')
    })
  })
})
