import { flow, head } from 'lodash'
import * as moment from 'moment'

import { splitNumbersAndLetters } from './string'

export const previusMonth = (source: Date = new Date()) => moment(source)
  .subtract(1, 'month')
  .toDate()

export const startOfTheDay = (source: Date) => moment(source)
  .startOf('day')
  .toDate()

export const endOfTheDay = (source: Date) => moment(source)
  .endOf('day')
  .toDate()

export const add = (date: Date, modifier: string) => flow(
  () => splitNumbersAndLetters(modifier),
  ({ letters, numbers }) => ({
    amount: head(numbers),
    unit: head(letters),
  }),
  ({ amount, unit }) => moment(date)
    .add(amount as any, unit)
    .toDate(),
)()
