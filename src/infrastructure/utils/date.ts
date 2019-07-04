import { flow, head } from 'lodash'
import * as moment from 'moment'

import { splitNumbersAndLetters } from '@app/utils/infrastructure/splitNumbersAndLetters'

export const add = (date: Date, modifier: string) =>
  flow(
    () => splitNumbersAndLetters(modifier),
    ({ letters, numbers }) => ({
      amount: head(numbers),
      unit: head(letters),
    }),
    ({ amount, unit }) =>
      moment(date)
        .add(amount as any, unit)
        .toDate(),
  )()
