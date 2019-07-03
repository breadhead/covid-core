import { lastDate } from '../lastDate'
import fc from 'fast-check'
import { dateArbitrary } from '@app/fc-utils/dateArbitrary'

describe('lastDate', () => {
  test('should return first date from array (1 element)', () => {
    fc.assert(
      fc.property(
        dateArbitrary(),
        date => lastDate(date).valueOf() === date.valueOf(),
      ),
    )
  })
})
