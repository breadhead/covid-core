import * as R from 'ramda'

type Capitalize = (s: string) => string
export const capitalize: Capitalize = R.converge(
  R.concat,
  [
    R.compose(R.toUpper, R.head),
    R.compose(R.toLower, R.tail),
  ],
)

type Strip = (sym: RegExp | string) => (string) => string
export const strip: Strip = (sym) => (target) => target.replace(sym, '')
