import { differenceInDays, getDay, differenceInMilliseconds } from 'date-fns'

const CHUNK_SIZE = 5

export const weekendDurationBetween = (start: Date, end: Date) => {
  const diff = differenceInDays(start, end)

  if (diff >= CHUNK_SIZE) {
    // makeChunks
  } else {
    console.log('diff:', getDay(start), getDay(end))
  }

  return 0
}
