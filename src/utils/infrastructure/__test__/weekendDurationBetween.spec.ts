import { weekendDurationBetween } from '../weekendDurationBetween'

const start = new Date('2019-06-04T13:11:41.564Z')
const end = new Date('2019-07-04T13:11:41.564Z')

describe('weekendDurationBetween', () => {
  test('should return number', () => {
    const actual = weekendDurationBetween(start, end)

    expect(typeof actual).toBe('number')
  })
})
