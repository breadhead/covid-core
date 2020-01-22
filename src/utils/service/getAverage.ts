export const getAverage = (values: number[]) => {
  if (values.length === 0) {
    return 0
  }

  if (values.length === 1) {
    return values[0]
  }

  return Math.round(values.reduce((acc, cur) => acc + cur, 0) / values.length)
}
