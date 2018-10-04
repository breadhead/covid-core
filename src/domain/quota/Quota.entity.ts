import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm'

import Company from '../company/Company.entity'

@Entity()
export default class Quota {
  @PrimaryColumn()
  public readonly id: string

  @Column({ length: 500, unique: true })
  public readonly name: string

  @Column()
  public readonly balance: number

  @JoinColumn()
  @OneToOne((type) => Company)
  public readonly company?: Company

  public constructor(id: string, name: string, balance: number, company?: Company) {
    this.id = id
    this.name = name
    this.balance = balance
    this.company = company
  }
}
