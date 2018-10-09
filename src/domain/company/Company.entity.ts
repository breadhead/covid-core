import { Column, Entity, PrimaryColumn } from 'typeorm'

@Entity()
export default class Company {
  @PrimaryColumn()
  public readonly name: string

  public constructor(name: string) {
    this.name = name
  }
}
