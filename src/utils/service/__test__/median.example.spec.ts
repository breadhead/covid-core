import { getMedian } from '../median'

describe('median', () => {
  test('should return 0 for empty array', () => {
    const actual = getMedian([])

    expect(actual).toBe(0)
  })

  test('should return first element for short array (1 element)', () => {
    const actual = getMedian([12])

    expect(actual).toBe(12)
  })

  test('should return value between elements for short array (2 element)', () => {
    const actual = getMedian([12, 14])

    expect(actual).toBe(13)
  })
})
