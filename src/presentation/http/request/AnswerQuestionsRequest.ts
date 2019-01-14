import { ApiModelProperty } from '@nestjs/swagger'

import QuestionWithAnswer, {
  questionWithAnswerExample,
} from './QuestionWithAnswer'

export default class AnswerQuestionsRequest {
  @ApiModelProperty({ example: 'jkjhhjhj34' })
  public readonly claimId: string

  @ApiModelProperty({ example: [questionWithAnswerExample], isArray: true })
  public readonly answers: QuestionWithAnswer[]
}
