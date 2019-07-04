import { eachDay, isWeekend } from 'date-fns'
import { MS_IN_DAY } from './MS_IN_DAY'

export const getIntervalWithoutHolidays = (start: Date, end: Date) => {
  const days = eachDay(start, end)
  const holidays = days.filter(isWeekend).length

  return holidays * MS_IN_DAY
}
