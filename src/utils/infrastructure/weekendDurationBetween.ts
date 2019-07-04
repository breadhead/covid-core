import { differenceInDays, eachDay } from 'date-fns'
import { getWeekendDuration } from './getWeekendDuration'
import { getDaysChunks } from './getDaysChunks'

const CHUNK_SIZE = 5
// start: Date, end: Date
export const weekendDurationBetween = () => {
  const start = new Date('2019-06-04T13:11:41.564Z')
  const end = new Date('2019-07-04T13:11:41.564Z')

  const diff = differenceInDays(start, end)

  if (Math.abs(diff) >= CHUNK_SIZE) {
    const days = eachDay(start, end)
    const daysChunks = getDaysChunks(days, CHUNK_SIZE)
    console.log('daysChunks:', daysChunks)
    // daysChunks.map(weekendDurationBetween)
  } else {
    getWeekendDuration(start, end)
  }

  return 0
}
