import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm'

import User from '../user/User.entity'

@Entity()
export default class Draft {
  @PrimaryColumn()
  public readonly id: string

  public get body() { return this._body }

  @ManyToOne((type) => User, { eager: true })
  @JoinColumn()
  public readonly author: User

  @Column({ type: 'json' })
  private _body: any

  public constructor(id: string, body: any, author: User) {
    this.id = id
    this._body = body
    this.author = author
  }

  public changeBody(body: any): void {
    this._body = body
  }
}
