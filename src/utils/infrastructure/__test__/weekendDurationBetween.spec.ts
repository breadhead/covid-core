import { weekendDurationBetween } from '../weekendDurationBetween'
import { MS_IN_DAY } from '../MS_IN_DAY'

const closeEnough = (execeptation: jest.Matchers<number>, expected: number) => {
  const ALLOWABLE_ERROR = 5
  execeptation.toBeLessThanOrEqual(expected + ALLOWABLE_ERROR)
  execeptation.toBeGreaterThanOrEqual(expected - ALLOWABLE_ERROR)
}

describe('weekendDurationBetween', () => {
  test('should return zero for interval wthout weekend', () => {
    const start = new Date(2019, 6, 1)
    const end = new Date(2019, 6, 5)

    const actual = weekendDurationBetween(start, end)

    expect(actual).toBe(0)
  })

  test('should return two days for only weekend', () => {
    const start = new Date(2019, 6, 6)
    const end = new Date(2019, 6, 8)

    const actual = weekendDurationBetween(start, end)

    closeEnough(expect(actual), MS_IN_DAY * 2)
  })
  test('should return two days for only weekend', () => {
    const start = new Date(2019, 6, 5)
    const end = new Date(2019, 6, 10)

    const actual = weekendDurationBetween(start, end)

    closeEnough(expect(actual), MS_IN_DAY * 2)
  })
  test('should return two days for only weekend', () => {
    const start = new Date(2019, 6, 4)
    const end = new Date(2019, 6, 18)

    const actual = weekendDurationBetween(start, end)

    closeEnough(expect(actual), MS_IN_DAY * 4)
  })
  test('should return two days for only weekend', () => {
    const start = new Date('Sat Jul 6 2019 12:00:00')
    const end = new Date('Sun Jul 7 2019 12:00:00')

    const actual = weekendDurationBetween(start, end)

    closeEnough(expect(actual), MS_IN_DAY)
  })
  test('should return two days for only weekend', () => {
    const start = new Date('Sat Jul 3 2019 12:00:00')
    const end = new Date('Sun Jul 6 2019 12:00:00')

    const actual = weekendDurationBetween(start, end)

    closeEnough(expect(actual), MS_IN_DAY / 2)
  })
  test('should return two days for only weekend', () => {
    const start = new Date('Sat Jul 6 2019 12:00:00')
    const end = new Date('Sun Jul 10 2019 12:00:00')

    const actual = weekendDurationBetween(start, end)

    closeEnough(expect(actual), MS_IN_DAY * 1.5)
  })
  test('should return two days for only weekend', () => {
    const start = new Date('Sat Jul 6 2019 12:00:00')
    const end = new Date('Sun Jul 21 2019 12:00:00')

    const actual = weekendDurationBetween(start, end)

    closeEnough(expect(actual), MS_IN_DAY * 5)
  })
  test('should return two days for only weekend', () => {
    const start = new Date('Sat Jul 6 2019 06:00:00')
    const end = new Date('Sun Jul 6 2019 18:00:00')

    const actual = weekendDurationBetween(start, end)

    closeEnough(expect(actual), MS_IN_DAY / 2)
  })
})
