import { Column, Entity, PrimaryColumn } from 'typeorm'

@Entity()
export default class Message {
  @PrimaryColumn()
  public readonly id: string

  @Column()
  public readonly date: Date

  @Column()
  public readonly content: string

  // TODO: Add link to claim
  // TODO: Add link to user

  public constructor(id: string, date: Date, content: string) {
    this.id = id
    this.date = date
    this.content = content
  }
}
