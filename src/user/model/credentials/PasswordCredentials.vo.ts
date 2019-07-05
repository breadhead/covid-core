import { Column } from 'typeorm'

export class PasswordCredentials {
  @Column({ nullable: true })
  public readonly password: string

  constructor(password?: string) {
    this.password = password
  }
}
