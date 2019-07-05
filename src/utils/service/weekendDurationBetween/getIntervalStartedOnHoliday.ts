import {
  eachDay,
  isWeekend,
  endOfDay,
  differenceInMilliseconds,
  addDays,
} from 'date-fns'
import { MS_IN_DAY } from './MS_IN_DAY'

export const getIntervalStartedOnHoliday = (start: Date, end: Date) => {
  const endOfTheCurrentDayCandidate = endOfDay(start)
  // на случай если начало и конец находятся в одном дне
  const endOfTheCurrentDay =
    endOfTheCurrentDayCandidate > end ? end : endOfTheCurrentDayCandidate

  const durationOfStartDay = Math.abs(
    differenceInMilliseconds(start, endOfTheCurrentDay),
  )
  const nextDay = addDays(endOfTheCurrentDay, 1)
  if (isWeekend(nextDay)) {
    const full = nextDay < end

    const nextDayDuration = full
      ? MS_IN_DAY
      : Math.abs(differenceInMilliseconds(endOfTheCurrentDay, end))

    return nextDayDuration + durationOfStartDay
  }

  return durationOfStartDay
}
