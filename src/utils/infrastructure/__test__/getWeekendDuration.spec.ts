import { getWeekendDuration } from '../getWeekendDuration'

const start = new Date('2019-07-01T13:11:41.564Z')
const end = new Date('2019-07-04T13:11:41.564Z')

describe('getWeekendDuration', () => {
  test('should return false', () => {
    const actual = getWeekendDuration(start, end)

    expect(actual).toBe(0)
  })
})
