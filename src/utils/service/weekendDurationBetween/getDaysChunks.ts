import { addDays } from 'date-fns'

export const getDaysChunks = (start: Date, end: Date, chunkSize: number) => {
  let current = start

  const chunks = []
  while (current <= end) {
    const chunkStart = current

    const chunkEndCandidate = addDays(current, chunkSize)
    const chunkEnd = chunkEndCandidate > end ? end : chunkEndCandidate

    const chunk = {
      start: chunkStart,
      end: chunkEnd,
    }

    current = chunkEndCandidate

    chunks.push(chunk)
  }

  return chunks
}
