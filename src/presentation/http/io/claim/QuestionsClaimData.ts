import { ApiModelProperty } from '@nestjs/swagger'

const squestionsExample: QuestionsClaimData = {
  id: 'fdsfds',
  defaultQuestions: ['Я умру?', 'Как скоро?'],
  additionalQuestions: ['Что делать, если я умру?'],
}

export default class QuestionsClaimData {
  @ApiModelProperty({ example: squestionsExample.id })
  public readonly id: string

  @ApiModelProperty({ example: squestionsExample.defaultQuestions })
  public readonly defaultQuestions: string[]

  @ApiModelProperty({ example: squestionsExample.additionalQuestions })
  public readonly additionalQuestions: string[]
}
