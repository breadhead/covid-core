import { InjectEntityManager } from '@nestjs/typeorm'
import { sortBy } from 'lodash'
import { Between, EntityManager, ObjectType } from 'typeorm'

import Income from './Income.entity'
import Transfer from './Transfer.entity'

export default class Historian {
  public constructor(
    @InjectEntityManager() private readonly em: EntityManager,
  ) {}

  public async getHistory(from: Date, to: Date): Promise<Array<Income | Transfer>> {
    const history = this.getEntityHistory(from, to)

    const [ transfers, incomes ] = await Promise.all([
      history(Transfer),
      history(Income),
    ])

    return sortBy(
      [...transfers, ...incomes],
      (entry) => entry.date,
    )
  }

  private getEntityHistory(from: Date, to: Date) {
    return <Entity>(entity: ObjectType<Entity>) => this.em
      .getRepository(entity)
      .find({ where: { date: Between(from, to) } })
  }
}
