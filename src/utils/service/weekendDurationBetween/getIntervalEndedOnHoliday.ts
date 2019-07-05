import {
  startOfDay,
  differenceInMilliseconds,
  isWeekend,
  subDays,
} from 'date-fns'
import { MS_IN_DAY } from './MS_IN_DAY'

export const getIntervalEndedOnHoliday = (start: Date, end: Date) => {
  const startOfTheCurrentDay = startOfDay(end)
  const durationOfEndDay = Math.abs(
    differenceInMilliseconds(startOfTheCurrentDay, end),
  )

  const prevDay = subDays(startOfTheCurrentDay, 1)
  if (isWeekend(prevDay)) {
    const full = prevDay > start

    const prevDayDuration = full
      ? MS_IN_DAY
      : Math.abs(differenceInMilliseconds(start, startOfTheCurrentDay))
    return prevDayDuration + durationOfEndDay
  }

  return durationOfEndDay
}
