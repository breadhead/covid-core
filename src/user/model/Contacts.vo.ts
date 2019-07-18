import { Column } from 'typeorm'

interface Params {
  email?: string
  phone?: string
  telegramId?: string
}

export class Contacts {
  @Column({ nullable: true })
  public readonly phone?: string

  @Column({ nullable: true })
  public readonly email?: string

  @Column({ nullable: true })
  public readonly telegramId?: string

  public constructor({ email, phone, telegramId }: Params = {}) {
    this.phone = phone
    this.email = email
    this.telegramId = telegramId
  }
}
