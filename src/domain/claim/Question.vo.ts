import { Column } from 'typeorm'

export default class Question {
  public readonly question: string
  public readonly answer?: string

  public constructor(question: string, answer?: string) {
    this.question = question
    this.answer = answer
  }
}
