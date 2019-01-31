import { Option } from 'tsoption'

import normalizeDate from '../normalizeDate'

describe('normalizeDate', () => {
  test('should return normalized provided date', () => {
    const input = Option.of(new Date('2019-10-11 12:45'))

    expect(normalizeDate()(input).getDate()).toBe(11)
    expect(normalizeDate()(input).getMonth()).toBe(9)
    expect(normalizeDate()(input).getFullYear()).toBe(2019)

    expect(normalizeDate()(input).getHours()).toBe(0)
    expect(normalizeDate()(input).getMinutes()).toBe(0)
    expect(normalizeDate()(input).getSeconds()).toBe(0)
  })

  test('should return normalized default date', () => {
    const input = Option.of(undefined) as Option<Date>
    const def = new Date('2019-10-11 12:45')

    expect(normalizeDate(def)(input).getDate()).toBe(11)
    expect(normalizeDate(def)(input).getMonth()).toBe(9)
    expect(normalizeDate(def)(input).getFullYear()).toBe(2019)

    expect(normalizeDate(def)(input).getHours()).toBe(0)
    expect(normalizeDate(def)(input).getMinutes()).toBe(0)
    expect(normalizeDate(def)(input).getSeconds()).toBe(0)
  })
})
