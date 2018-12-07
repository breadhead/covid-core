import Company from '../../../company/Company.entity'
import Income from '../../../quota/Income.entity'
import Quota from '../../../quota/Quota.entity'

import incomesToDonators from '../incomesToDonators'

const createMockQuota = (company: Company) =>
  new Quota('1', 'mock quota', [], company)

describe('incomesToDonators', () => {
  test('should return empty array for empty history', () => {
    const donators = incomesToDonators([])

    expect(donators).toHaveLength(0)
  })

  test('should return donators with total amount according to 1 transaction', () => {
    const history = [
      new Income(createMockQuota(new Company('Сбербанк')), 100, new Date()),
    ]

    const donators = incomesToDonators(history)

    expect(donators.reduce((prev, cur) => prev + cur.donation, 0)).toEqual(100)
  })

  test('should return donators with total amount according to many transaction', () => {
    const history = [
      new Income(createMockQuota(new Company('Сбербанк')), 100, new Date()),
    ]

    const donators = incomesToDonators(history)

    expect(donators.reduce((prev, cur) => prev + cur.donation, 0)).toEqual(100)
  })

  test('should return one donators for one transaction', () => {
    const company = new Company('Сбербанк')

    const history = [
      new Income(createMockQuota(company), 100, new Date()),
      new Income(createMockQuota(company), 150, new Date()),
      new Income(createMockQuota(company), 200, new Date()),
    ]

    const donators = incomesToDonators(history)

    expect(donators.reduce((prev, cur) => prev + cur.donation, 0)).toEqual(450)
  })

  test('should return one donators for many transaction from one company', () => {
    const company = new Company('Сбербанк')

    const history = [
      new Income(createMockQuota(company), 100, new Date()),
      new Income(createMockQuota(company), 150, new Date()),
      new Income(createMockQuota(company), 200, new Date()),
    ]

    const donators = incomesToDonators(history)

    expect(donators).toHaveLength(1)
  })

  test('should return two donators for tso transaction from different companies', () => {
    const companyOne = new Company('Сбербанк')
    const companyTwo = new Company('Газпром')

    const history = [
      new Income(createMockQuota(companyOne), 100, new Date()),
      new Income(createMockQuota(companyTwo), 150, new Date()),
      new Income(createMockQuota(companyOne), 200, new Date()),
    ]

    const donators = incomesToDonators(history)

    expect(donators).toHaveLength(2)
  })
})
