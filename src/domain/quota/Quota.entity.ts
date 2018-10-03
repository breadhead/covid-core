import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm'

import Company from '../company/Company.entity'

@Entity()
export default class Quota {
  @PrimaryColumn()
  public readonly id: number

  @Column({ length: 500 })
  public readonly name: string

  @Column()
  public readonly balance: number

  @JoinColumn()
  @OneToOne((type) => Company)
  public readonly company: Company
}
