import { previusMonth } from '../date'

describe('previusMonth', () => {
  test('should return date in previous month simple date', () => {
    const input = new Date('2018-10-11')
    expect(previusMonth(input).getDate()).toBe(11)
    expect(previusMonth(input).getMonth()).toBe(8)
    expect(previusMonth(input).getFullYear()).toBe(2018)
  })

  test('should return date in previous month from start of year', () => {
    const input = new Date('2018-01-11')
    expect(previusMonth(input).getDate()).toBe(11)
    expect(previusMonth(input).getMonth()).toBe(11)
    expect(previusMonth(input).getFullYear()).toBe(2017)
  })

  test('should return date in previous month from strange month', () => {
    const input = new Date('2018-03-30')
    expect(previusMonth(input).getDate()).toBe(28)
    expect(previusMonth(input).getMonth()).toBe(1)
    expect(previusMonth(input).getFullYear()).toBe(2018)
  })
})