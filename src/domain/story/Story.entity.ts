import { Column, Entity, PrimaryColumn } from 'typeorm'
import { StoryEnum } from './StoryEnum'

@Entity('story')
export default class Story {
  @PrimaryColumn()
  public readonly id: string

  @Column({ default: '2019-10-21 13:00:00' })
  public readonly _createdAt: Date

  get createdAt() {
    return this._createdAt
  }

  @Column({ nullable: true })
  public readonly _claimId: string

  get claimId() {
    return this._claimId
  }

  @Column()
  public readonly number: number

  @Column()
  public readonly phone: string

  @Column({ nullable: true })
  public readonly status: StoryEnum

  public constructor(
    id: string,
    createdAt = new Date(),
    claimId: string,
    number: number,
    phone: string,
    status: StoryEnum,
  ) {
    this.id = id
    this._createdAt = createdAt
    this._claimId = claimId
    this.number = number
    this.phone = phone
    this.status = status
  }
}
