import { Column, Entity, PrimaryColumn } from 'typeorm'

@Entity('rating')
export default class Rating {
  @PrimaryColumn()
  public readonly id: string

  @Column({ default: '2019-10-21 13:00:00' })
  public readonly _ratingDate: Date

  get ratingDate() {
    return this._ratingDate
  }

  @Column({ nullable: true })
  public readonly _claimId: string

  get claimId() {
    return this._claimId
  }

  @Column()
  public readonly _questionId: string

  get questionId() {
    return this._questionId
  }

  @Column({ nullable: true })
  public readonly _answerType: string

  get answerText() {
    return this._answerType
  }

  @Column({ nullable: true })
  public readonly _answerValue: string

  get answerValue() {
    return this._answerValue
  }

  public constructor(
    id: string,
    ratingDate = new Date(),
    claimId: string,
    questionId: string,
    answerType: string,
    answerValue: string,
  ) {
    this.id = id
    this._ratingDate = ratingDate
    this._claimId = claimId
    this._questionId = questionId
    this._answerType = answerType
    this._answerValue = answerValue
  }
}
