export const lastDate = (...dates: Date[]) => {
  const realDates = dates.filter(Boolean)

  if (realDates.length === 0) {
    return new Date()
  }

  return realDates.reduce((lastDate, date) => {
    if (date > lastDate) {
      return date
    }

    return lastDate
  })
}
