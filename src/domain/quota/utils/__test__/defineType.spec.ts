import { QuotaType } from '../../Quota.entity'
import defineType from '../defineType'

describe('defineType', () => {
  describe('corporate', () => {
    test('should return corporate if corporate and have no constraints', async () => {
      const entry = { corporate: true, constraints: [] }
      expect(defineType(entry)).toBe(QuotaType.Corporate)
    })

    test('should return corporate if corporate and have some constraints', async () => {
      const entry = {
        corporate: true,
        constraints: ['first constraint', 'second constraint'],
      }
      expect(defineType(entry)).toBe(QuotaType.Corporate)
    })
  })

  describe('special', () => {
    test('should return special if not corporate and have some constraints', async () => {
      const entry = {
        corporate: false,
        constraints: ['first constraint', 'second constraint'],
      }
      expect(defineType(entry)).toBe(QuotaType.Special)
    })
  })

  describe('common', () => {
    test('should return common if not corporate and have no constraints', async () => {
      const entry = { corporate: false, constraints: [] }
      expect(defineType(entry)).toBe(QuotaType.Common)
    })
  })
})
