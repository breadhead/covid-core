import { isItHoliday } from './isItHoliday'

export const getWeekendDuration = (start: Date, end: Date) => {
  if ([start, end].some(isItHoliday)) {
    // some code
  } else {
    return 0
  }
}
