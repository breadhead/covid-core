import { Entity, PrimaryColumn } from 'typeorm'

@Entity()
export default class User {
  @PrimaryColumn()
  public readonly id: string

  public constructor(id: string) {
    this.id = id
  }
}
