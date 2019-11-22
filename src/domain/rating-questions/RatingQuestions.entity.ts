import { Column, Entity, PrimaryColumn } from 'typeorm'

@Entity('ratingQuestions')
export default class RatingQuestions {
  @PrimaryColumn()
  public readonly id: string

  @Column()
  public readonly _type: string

  @Column()
  public readonly _order: number

  get order() {
    return this._order
  }

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

  public constructor(
    id: string,
    type: string,
    order: number,
    question: string,
    hint: string,
  ) {
    this.id = id
    this._type = type
    this._order = order
    this._question = question
    this._hint = hint
  }
}
