import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm'
import { User } from '@app/user/model/User.entity'

@Entity()
export default class Draft {
  @PrimaryColumn()
  public readonly id: string

  @Column(type => Date)
  public readonly createdAt: Date

  public get body() {
    return this._body
  }

  @ManyToOne(type => User, { eager: true })
  @JoinColumn()
  public readonly author: User

  @Column()
  public readonly personal: boolean = true

  @Column({ type: 'json' })
  private _body: any

  public constructor(
    id: string,
    createdAt: Date,
    body: any,
    author: User,
    personal: boolean = true,
  ) {
    this.id = id
    this.createdAt = createdAt
    this._body = body
    this.author = author
    this.personal = true
  }

  public changeBody(body: any): void {
    this._body = body
  }
}
