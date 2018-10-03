import { Column, Entity, PrimaryColumn } from 'typeorm'

@Entity()
export default class Quota {
  @PrimaryColumn()
  public readonly id: number

  @Column({ length: 500 })
  public readonly name: string

  @Column()
  public readonly balance: number
}
