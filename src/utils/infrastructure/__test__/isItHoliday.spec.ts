import { isItHoliday } from '../isItHoliday'

describe('isItHoliday', () => {
  test('should return false', () => {
    const date = new Date('2019-07-05T13:11:41.564Z')
    const actual = isItHoliday(date)

    expect(actual).toBe(false)
  })
  test('should return false', () => {
    const date = new Date('2019-07-08T13:11:41.564Z')
    const actual = isItHoliday(date)

    expect(actual).toBe(false)
  })
  test('should return true', () => {
    const date = new Date('2019-07-06T13:11:41.564Z')
    const actual = isItHoliday(date)

    expect(actual).toBe(true)
  })
  test('should return true', () => {
    const date = new Date('2019-07-07T13:11:41.564Z')
    const actual = isItHoliday(date)

    expect(actual).toBe(true)
  })
})
