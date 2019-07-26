import { eachDay, isWeekend } from 'date-fns'
import { MS_IN_DAY } from './MS_IN_DAY'

export const getIntervalWithoutHolidays = (start: Date, end: Date) => {
  let [from, to] = [start, end]

  if (from > to) {
    ;[from, to] = [to, from]
  }

  const days = eachDay(start, end)
  const holidays = days.filter(isWeekend).length

  return holidays * MS_IN_DAY
}
