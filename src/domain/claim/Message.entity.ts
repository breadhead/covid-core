import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm'

import User from '../user/User.entity'
import Claim from './Claim.entity'

@Entity()
export default class Message {
  @PrimaryColumn()
  public readonly id: string

  @Column()
  public readonly date: Date

  @Column()
  public readonly content: string

  @JoinColumn()
  @ManyToOne(type => Claim, { eager: true })
  public readonly claim: Claim

  @JoinColumn()
  @ManyToOne(type => User, { eager: true })
  public readonly user: User

  public get notificated() {
    return this._notificated
  }

  @Column()
  private _notificated: boolean = false

  public constructor(
    id: string,
    date: Date,
    content: string,
    claim: Claim,
    user: User,
  ) {
    this.id = id
    this.date = date
    this.content = content
    this.claim = claim
    this.user = user
  }

  public markAsNotificated(): void {
    this._notificated = true
  }
}
