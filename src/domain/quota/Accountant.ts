import { Injectable } from '@nestjs/common'
import { InjectEntityManager } from '@nestjs/typeorm'
import { EntityManager } from 'typeorm'

import Income from './Income.entity'
import Quota from './Quota.entity'
import Transfer from './Transfer.entity'

@Injectable()
export default class Accountant {
  public constructor(
    @InjectEntityManager() private readonly em: EntityManager,
  ) {}

  public async tranfser(
    source: Quota,
    target: Quota,
    amount: number,
  ): Promise<void> {
    await this.em.transaction(em => {
      source.decreaseBalance(amount)
      target.increaseBalance(amount)

      const transfer = new Transfer(source, target, amount, new Date())

      return Promise.all([em.save(source), em.save(target), em.save(transfer)])
    })
  }

  public async income(target: Quota, amount: number): Promise<void> {
    await this.em.transaction(em => {
      target.increaseBalance(amount)

      const incomeRecord = new Income(target, amount, new Date())

      return Promise.all([em.save(target), em.save(incomeRecord)])
    })
  }
}
