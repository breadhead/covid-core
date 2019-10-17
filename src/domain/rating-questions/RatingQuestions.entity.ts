import { Column, Entity, PrimaryColumn } from 'typeorm'

@Entity('ratingQuestion')
export default class RatingQuestions {
  @PrimaryColumn()
  public readonly id: string

  @Column()
  public readonly _type: string

  get type() {
    return this._type
  }

  @Column()
  public readonly _question: string

  get question() {
    return this._question
  }

  @Column()
  public readonly _hint: string

  get hint() {
    return this._hint
  }

  public constructor(id: string, type: string, question: string, hint: string) {
    this.id = id
    this._type = type
    this._question = question
    this._hint = hint
  }
}
