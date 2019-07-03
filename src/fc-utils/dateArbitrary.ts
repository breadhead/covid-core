import fc from 'fast-check'

export const dateArbitrary = (start?: Date, end?: Date) => {
  let integerArb: fc.Arbitrary<number> = null
  if (start && end) {
    integerArb = fc.integer(start.valueOf(), end.valueOf())
  } else if (start) {
    integerArb = fc.integer(start.valueOf(), Number.MAX_SAFE_INTEGER)
  } else if (end) {
    integerArb = fc.integer(end.valueOf())
  } else {
    integerArb = fc.integer()
  }

  return integerArb.map(timestamp => new Date(timestamp))
}
