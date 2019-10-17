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
  public readonly _answerValue: string

  get answerValue() {
    return this._answerValue
  }

  @Column({ nullable: true })
  public readonly _answerText: string

  get answerText() {
    return this._answerText
  }

  public constructor(
    id: string,
    ratingDate = new Date(),
    claimId: string,
    questionId: string,
    answerValue: string,
    answerText: string,
  ) {
    this.id = id
    this._ratingDate = ratingDate
    this._claimId = claimId
    this._questionId = questionId
    this._answerValue = answerValue
    this._answerText = answerText
  }
}
