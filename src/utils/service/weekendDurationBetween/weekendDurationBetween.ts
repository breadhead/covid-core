import { differenceInDays } from 'date-fns'
import { getWeekendDuration } from './getWeekendDuration'
import { getDaysChunks } from './getDaysChunks'

const CHUNK_SIZE = 5

export const weekendDurationBetween = (start: Date, end: Date): number => {
  if (Math.abs(differenceInDays(start, end)) <= CHUNK_SIZE) {
    return getWeekendDuration(start, end)
  }

  return getDaysChunks(start, end, CHUNK_SIZE)
    .filter(({ start, end }) => end - start > 1)
    .map(({ start, end }) => weekendDurationBetween(start, end))
    .reduce((a, b) => a + b, 0)
}
