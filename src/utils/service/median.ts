export const getMedian = (values: number[]) => {
  if (values.length === 0) {
    return 0
  }

  if (values.length === 1) {
    return values[0]
  }

  const sorted = values.sort((a, b) => a - b)

  if (sorted.length % 2 === 1) {
    const meanIndex = Math.trunc(sorted.length / 2)

    return sorted[meanIndex]
  }

  const maxMeanIndex = sorted.length / 2
  const minMeanIndex = maxMeanIndex - 1

  const minMeanValue = sorted[minMeanIndex]
  const maxMeanValue = sorted[maxMeanIndex]

  return Number(((maxMeanValue + minMeanValue) / 2).toFixed(2))
}
