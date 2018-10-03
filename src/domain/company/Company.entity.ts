import { Column, Entity, PrimaryColumn } from 'typeorm'

@Entity()
export default class Company {
  @PrimaryColumn()
  public readonly id: string

  @Column({ length: 255 })
  public readonly name: string
}
