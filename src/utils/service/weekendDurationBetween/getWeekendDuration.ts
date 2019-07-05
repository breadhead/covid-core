import { isWeekend } from 'date-fns'

import LogicException from '@app/presentation/http/exception/LogicException'
import { getIntervalWithoutHolidays } from './getIntervalWithoutHolidays'
import { getIntervalStartedOnHoliday } from './getIntervalStartedOnHoliday'
import { getIntervalEndedOnHoliday } from './getIntervalEndedOnHoliday'

export const getWeekendDuration = (start: Date, end: Date) => {
  if (!isWeekend(start) && !isWeekend(end)) {
    return getIntervalWithoutHolidays(start, end)
  }

  if (isWeekend(start)) {
    return getIntervalStartedOnHoliday(start, end)
  }

  if (isWeekend(end)) {
    return getIntervalEndedOnHoliday(start, end)
  }

  throw new LogicException('')
}
