import {
  isWeekend,
  eachDay,
  endOfDay,
  differenceInMilliseconds,
  addDays,
  startOfDay,
  subDays,
} from 'date-fns'

import LogicException from '@app/presentation/http/exception/LogicException'
import { MS_IN_DAY } from './MS_IN_DAY'

export const getWeekendDuration = (start: Date, end: Date) => {
  if (!isWeekend(start) && !isWeekend(end)) {
    const days = eachDay(start, end)
    const holidays = days.filter(isWeekend).length

    return holidays * MS_IN_DAY
  }

  if (isWeekend(start)) {
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

  if (isWeekend(end)) {
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

  throw new LogicException('')
}
