export const lastDate = (...dates: Date[]) =>
  dates.reduce((lastDate, date) => {
    if (date > lastDate) {
      return date
    }

    return lastDate
  }, new Date())
