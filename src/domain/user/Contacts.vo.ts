import { Column } from 'typeorm'

export interface Params {
  email?: string
  phone?: string
}

export default class Contacts {
  @Column({ nullable: true })
  public readonly phone?: string

  @Column({ nullable: true })
  public readonly email?: string

  public constructor({ email, phone }: Params = {}) {
    this.phone = phone
    this.email = email
  }
}
