import { differenceInDays } from 'date-fns'
import { getWeekendDuration } from './getWeekendDuration'

const CHUNK_SIZE = 5

export const weekendDurationBetween = (start: Date, end: Date) => {
  const diff = differenceInDays(start, end)

  if (diff >= CHUNK_SIZE) {
    // makeChunks
  } else {
    getWeekendDuration(start, end)
  }

  return 0
}
