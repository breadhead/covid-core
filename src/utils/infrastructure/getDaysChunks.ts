export const getDaysChunks = (days: Date[], chunkSize: number) => {
  const arr = []
  for (let i = 0; i < days.length; i += chunkSize) {
    arr.push(days.slice(i, i + chunkSize))
  }
  return [...arr]
}
