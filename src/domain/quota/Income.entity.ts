import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'

import Company from '../company/Company.entity'

import Quota from './Quota.entity'

@Entity()
export default class Income {
  @PrimaryGeneratedColumn('increment')
  public readonly id

  @JoinColumn()
  @ManyToOne((type) => Quota)
  public readonly target: Quota

  @Column()
  public readonly amount: number

  @Column()
  public readonly date: Date

  @JoinColumn()
  @ManyToOne((type) => Company)
  public readonly payer?: Company

  public constructor(target: Quota, amount: number, date: Date) {
    this.target = target
    this.amount = amount
    this.date = date

    if (target) { // because TypeORM call contructor with empty args
      this.payer = target.company
    }
  }
}
