import { InjectEntityManager } from '@nestjs/typeorm'
import { sortBy } from 'lodash'
import { Between, EntityManager, ObjectType } from 'typeorm'

import Donator from '../../company/Donator.dto'
import Income from '../../quota/Income.entity'
import Transfer from '../../quota/Transfer.entity'

import incomesToDonators from './incomesToDonators'

export default class Historian {
  public constructor(
    @InjectEntityManager() private readonly em: EntityManager,
  ) {}

  public async getDonators(from: Date, to: Date): Promise<Donator[]> {
    const history = await this.getEntityHistory(from, to)(Income)

    const notCorporateIncomes = history.filter(
      income => !income.target.corporate,
    )

    return incomesToDonators(notCorporateIncomes)
  }

  public async getHistory(
    from: Date,
    to: Date,
  ): Promise<Array<Income | Transfer>> {
    const history = this.getEntityHistory(from, to)

    const [transfers, incomes] = await Promise.all([
      history(Transfer),
      history(Income),
    ])

    return sortBy([...transfers, ...incomes], entry => entry.date)
  }

  private getEntityHistory(from: Date, to: Date) {
    return <Entity>(entity: ObjectType<Entity>) =>
      this.em.getRepository(entity).find({ where: { date: Between(from, to) } })
  }
}
