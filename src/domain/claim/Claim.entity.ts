import { Column, Entity, PrimaryColumn } from 'typeorm'

@Entity()
export default class Claim {
  @PrimaryColumn()
  public readonly id: string

  public constructor(id: string) {
    this.id = id
  }
}
