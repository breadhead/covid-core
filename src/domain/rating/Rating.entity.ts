import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm'

@Entity()
export default class Rating {
  @PrimaryColumn()
  public readonly id: string

  @Column({ default: '2019-10-21 13:00:00' })
  public readonly createdAt: Date

  public get comment() {
    return this._comment
  }

  @Column()
  private _comment: string

  public constructor(id: string, comment = '', createdAt = new Date()) {
    this.id = id
    this._comment = comment
    this.createdAt = createdAt
  }
}
