import { getDay } from 'date-fns'

export const getWeekendDuration = (start: Date, end: Date) => {
  console.log('diff:', getDay(start), getDay(end))
}
