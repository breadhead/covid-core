import { getYearAgoMonthRange } from '../getYearAgoMonthRange'

describe('getYearAgoMonthRange', () => {
  test('should works', () => {
    const res = getYearAgoMonthRange(
      new Date('Thu Jan 23 2020 14:44:39 GMT+0300 (Moscow Standard Time)'),
    )

    expect(res[0].first.getDate()).toBe(1)
    expect(res[0].last.getDate()).toBe(31)
  })
})
