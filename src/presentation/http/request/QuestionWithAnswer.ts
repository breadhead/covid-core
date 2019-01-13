import { ApiModelProperty } from '@nestjs/swagger'

export const questionWithAnswerExample: QuestionWithAnswer = {
  question: 'Я умру?',
  answer: 'Да',
}

export default class QuestionWithAnswer {
  @ApiModelProperty({ example: questionWithAnswerExample.question })
  public question: string

  @ApiModelProperty({ example: questionWithAnswerExample.answer })
  public answer: string
}
