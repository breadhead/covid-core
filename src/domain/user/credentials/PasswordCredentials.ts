import { Column } from 'typeorm'

export default class PasswordCredentials {
  @Column()
  public readonly password: string

  constructor(password: string) {
    this.password = password
  }
}
