import { getAverage } from '../getAverage'

describe('getAverage', () => {
  test('should return 0 for empty array', () => {
    const actual = getAverage([])

    expect(actual).toBe(0)
  })

  test('should return 5 for array', () => {
    const actual = getAverage([4, 6])

    expect(actual).toBe(5)
  })

  test('should return 10 for array', () => {
    const actual = getAverage([3, 4, 6, 29])

    expect(actual).toBe(11)
  })
})
