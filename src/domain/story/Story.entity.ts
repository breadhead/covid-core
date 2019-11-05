import { Column, Entity, PrimaryColumn } from 'typeorm'

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
  public readonly phone: string

  @Column({ nullable: true })
  public readonly status: string

  public constructor(
    id: string,
    createdAt = new Date(),
    claimId: string,
    phone: string,
    status: string,
  ) {
    this.id = id
    this._createdAt = createdAt
    this._claimId = claimId
    this.phone = phone
    this.status = status
  }
}
