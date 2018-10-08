import * as moment from 'moment'

export const previusMonth = (source: Date = new Date()) => moment(source)
  .subtract(1, 'month')
  .toDate()

export const startOfTheDay = (source: Date) => moment(source)
  .startOf('day')
  .toDate()

export const endOfTheDay = (source: Date) => moment(source)
  .endOf('day')
  .toDate()
