import { Entity, PrimaryColumn } from 'typeorm'

@Entity()
export default class User {
  @PrimaryColumn()
  public readonly login: string

  public constructor(login: string) {
    this.login = login
  }
}
