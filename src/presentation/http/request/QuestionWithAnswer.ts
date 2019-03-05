import { ApiModelProperty } from '@nestjs/swagger'

import { QuestionWithAnswer as QuestionWithAnswerInApp } from '@app/application/claim/questions/dto/QuestionWithAnswer'

export const questionWithAnswerExample: QuestionWithAnswerInApp = {
  question: 'Я умру?',
  answer: 'Да',
}

export default class QuestionWithAnswer implements QuestionWithAnswerInApp {
  @ApiModelProperty({ example: questionWithAnswerExample.question })
  public question: string

  @ApiModelProperty({ example: questionWithAnswerExample.answer })
  public answer: string
}
