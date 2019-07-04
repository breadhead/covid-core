import * as moment from 'moment'
import { add } from '../date'

describe('add', () => {
  test('should add days', () => {
    const date = add(new Date(), '2d')

    const TWO_DAYS = Math.round(172800000 / 86400000)
    const recived = Math.round(moment(date).diff(moment()) / 86400000)
    expect(recived).toBe(TWO_DAYS)
  })
})
