import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm'

import Quota from './Quota.entity'

@Entity()
export default class Transfer {
  @PrimaryGeneratedColumn('increment')
  public readonly id

  @JoinColumn()
  @ManyToOne(type => Quota, { eager: true })
  public readonly source: Quota

  @JoinColumn()
  @ManyToOne(type => Quota, { eager: true })
  public readonly target: Quota

  @Column()
  public readonly amount: number

  @Column()
  public readonly date: Date

  public constructor(source: Quota, target: Quota, amount: number, date: Date) {
    this.source = source
    this.target = target
    this.amount = amount
    this.date = date
  }
}
