import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm'

import Quota from './Quota.entity'

@Entity()
export default class Transfer {
  @PrimaryGeneratedColumn('increment')
  public readonly id

  @JoinColumn()
  @OneToOne((type) => Quota)
  public readonly source: Quota

  @JoinColumn()
  @OneToOne((type) => Quota)
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
