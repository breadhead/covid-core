import { flow, groupBy, head } from 'lodash'

import Donator from '../../company/Donator.dto'
import Income from '../../quota/Income.entity'

const sumBy = (prop) => (prev, cur) => prev + cur[prop]

type IncomesToDonators = (incomes: Income[]) => Donator[]

const incomesToDonators: IncomesToDonators = flow([
  (incomes) => groupBy(incomes, (income: Income) => income.payer.name),
  (grouped) => Object.entries(grouped),
  (entries) => entries.map(([ _, incomes ]) => ({ incomes })),
  (history) => history.map(({ incomes }) => ({
    company: head<Income>(incomes).payer,
    amount: incomes.reduce(sumBy('amount'), 0),
  })),
  (history) => history.map(({ company, amount }) => ({
    name: company.name,
    donation: amount,
  } as Donator)),
])

export default incomesToDonators
