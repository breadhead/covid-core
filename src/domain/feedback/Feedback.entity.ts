import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm'

@Entity()
export default class Feedback {
  @PrimaryColumn()
  public readonly id: string

  @Column()
  public readonly date: Date

  @Column()
  public readonly name: string

  @Column({ nullable: true })
  public readonly email?: string

  @Column({ nullable: true })
  public readonly phone?: string

  @Column({ nullable: true })
  public readonly theme?: string

  @Column()
  public readonly content: string

  public constructor(
    id: string,
    date: Date,
    name: string,
    content: string,
    theme?: string,
    email?: string,
    phone?: string,
  ) {
    this.id = id
    this.date = date
    this.name = name
    this.content = content
    this.theme = theme
    this.email = email
    this.phone = phone
  }
}
