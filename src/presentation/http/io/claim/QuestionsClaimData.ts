import { ApiModelProperty } from '@nestjs/swagger'

import Claim from '@app/domain/claim/Claim.entity'

const questionsExample: QuestionsClaimData = {
  id: 'fdsfds',
  defaultQuestions: ['Я умру?', 'Как скоро?'],
  additionalQuestions: ['Что делать, если я умру?'],
}

export default class QuestionsClaimData {
  public static fromEntity(claim: Claim): QuestionsClaimData {
    const { questions, id } = claim
    const { defaultQuestions, additionalQuestions } = questions

    return {
      id,
      defaultQuestions,
      additionalQuestions,
    } as QuestionsClaimData
  }

  @ApiModelProperty({ example: questionsExample.id })
  public readonly id: string

  @ApiModelProperty({ example: questionsExample.defaultQuestions })
  public readonly defaultQuestions: string[]

  @ApiModelProperty({ example: questionsExample.additionalQuestions })
  public readonly additionalQuestions: string[]
}
