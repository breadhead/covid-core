import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm'

@Entity()
export default class Quota {
  @PrimaryGeneratedColumn()
  public readonly id: number

  @Column({ length: 500 })
  public readonly name: string

  @Column()
  public readonly balance: number
}
