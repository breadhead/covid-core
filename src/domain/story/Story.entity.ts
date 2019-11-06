import { Column, Entity, PrimaryColumn, JoinColumn, OneToOne } from 'typeorm'
import { StoryEnum } from './StoryEnum'
import Claim from '../claim/Claim.entity'

@Entity('story')
export default class Story {
  @PrimaryColumn()
  public readonly id: string

  @Column({ default: '2019-10-21 13:00:00' })
  public readonly _createdAt: Date

  get createdAt() {
    return this._createdAt
  }

  @JoinColumn({ name: 'claimId', referencedColumnName: 'id' })
  @OneToOne(type => Claim, { eager: true })
  public readonly claim: Claim

  @Column()
  public readonly phone: string

  @Column({ nullable: true })
  public status: StoryEnum

  public constructor(
    id: string,
    createdAt = new Date(),
    claim: Claim,
    phone: string,
    status: StoryEnum,
  ) {
    this.id = id
    this._createdAt = createdAt
    this.claim = claim
    this.phone = phone
    this.status = status
  }

  public updateStatus(status: StoryEnum) {
    this.status = status
  }
}
