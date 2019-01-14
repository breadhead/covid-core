import { ApiModelProperty } from '@nestjs/swagger'

import Claim from '@app/domain/claim/Claim.entity'

export const exampleClaim = {
  id: 'gjkfdhg34kJK',
  defaultQuestions: [{ question: 'Я умру?' }],
  additionalQuestions: [{ question: 'Что делать?', answer: 'Расслабиться' }],
}

interface Question {
  question: string
  answer?: string
}

export default class ClaimQuestionsResponse {
  public static fromEntity(
    ansewred: boolean,
  ): (claim: Claim) => ClaimQuestionsResponse {
    return (claim: Claim) => {
      if (ansewred) {
        return {
          id: claim.id,
          defaultQuestions: claim.answeredQuestions.defaultQuestions,
          additionalQuestions: claim.answeredQuestions.additionalQuestions,
        }
      }

      const defaultQuestions = claim.questions.defaultQuestions.map(
        question => ({ question }),
      )
      const additionalQuestions = claim.questions.additionalQuestions.map(
        question => ({ question }),
      )

      return {
        id: claim.id,
        defaultQuestions,
        additionalQuestions,
      }
    }
  }

  @ApiModelProperty({ example: exampleClaim.id })
  public readonly id: string

  @ApiModelProperty({ example: exampleClaim.defaultQuestions, isArray: true })
  public readonly defaultQuestions: Question[]

  @ApiModelProperty({
    required: false,
    example: exampleClaim.additionalQuestions,
    isArray: true,
  })
  public readonly additionalQuestions?: Question[]
}
