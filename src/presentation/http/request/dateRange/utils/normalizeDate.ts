import { Option } from 'tsoption'
import { startOfDay } from 'date-fns'

import LogicException from '../../../exception/LogicException'

export default (def: Date = new Date()) => (date: Option<Date>) => {
  const normalized = date.orElse(Option.of(def)).map(startOfDay)

  if (normalized.nonEmpty()) {
    return normalized.get()
  }

  throw new LogicException('Something went wrong')
}
