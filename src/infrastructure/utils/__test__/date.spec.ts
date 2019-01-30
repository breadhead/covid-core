import * as moment from 'moment'
import { add, previusMonth } from '../date'

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

describe('add', () => {
  test('should add days', () => {
    const date = add(new Date(), '2d')

    const MS_IN_2_DAYS = 172800000
    expect(moment(date).diff(moment(new Date()))).toBe(MS_IN_2_DAYS)
  })
})
