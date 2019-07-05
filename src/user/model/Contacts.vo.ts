import { Column } from 'typeorm'

interface Params {
  email?: string
  phone?: string
}

export class Contacts {
  @Column({ nullable: true })
  public readonly phone?: string

  @Column({ nullable: true })
  public readonly email?: string

  public constructor({ email, phone }: Params = {}) {
    this.phone = phone
    this.email = email
  }
}
