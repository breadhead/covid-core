import { getDay } from 'date-fns'
import { DayInWeekKey } from './dayInWeekKey'

export const isItHoliday = (day: Date) =>
  getDay(day) === DayInWeekKey.Sat || getDay(day) === DayInWeekKey.Sun
