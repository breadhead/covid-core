import * as moment from 'moment'
import { Option } from 'tsoption'

import LogicException from '../../../exception/LogicException'

export default (def: Date = new Date()) => (date: Option<Date>) => {
  const normalized = date
    .orElse(Option.of(def))
    .map(d => moment(d))
    .map(m => m.startOf('day'))
    .map(m => m.toDate())

  if (normalized.nonEmpty()) {
    return normalized.get()
  }

  throw new LogicException('Something went wrong')
}
