import { matches } from 'z'

import { QuotaType } from '../Quota.entity'

interface Entry {
  corporate: boolean,
  constraints: string[],
}

export default (entry: Entry) => matches(entry)(
  (e = { corporate: true }) => QuotaType.Corporate,
  (e = { constraints: [] }) => QuotaType.Common,
  (e)                       => QuotaType.Special,
)
