import {
  eachDay,
  getMonth,
  startOfMonth,
  endOfMonth,
  addMonths,
} from 'date-fns'

export const getMonthRange = (from: Date, to: Date) => {
  const start = getMonth(from)
  const end = getMonth(to)

  return []
}
