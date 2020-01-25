import { endOfMonth, addMonths, subMonths, subDays, getMonth } from 'date-fns'

export const getYearAgoMonthRange = (date: Date) => {
  const arr = []

  let prev = addMonths(date, 1)
  for (let i = 12; i > 0; i--) {
    const current = subMonths(prev, 1)
    const monthName: number = getMonth(current)
    const first = subDays(current, current.getDate() - 1)
    const last = endOfMonth(current)

    arr.push({ first, last, monthName })

    prev = current
  }

  return arr
}
