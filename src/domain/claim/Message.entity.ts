import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm'

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
  @ManyToOne((type) => Claim)
  public readonly claim: Claim

  // TODO: Add link to user

  public constructor(id: string, date: Date, content: string, claim: Claim) {
    this.id = id
    this.date = date
    this.content = content
    this.claim = claim
  }
}
