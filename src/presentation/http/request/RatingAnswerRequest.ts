import { ApiModelProperty } from '@nestjs/swagger'

export default class RatingAnswerRequest {
  @ApiModelProperty({ example: 1 })
  public readonly claimId: string

  @ApiModelProperty({ example: 'question' })
  public readonly question: string

  @ApiModelProperty({ example: 'answerType' })
  public readonly answerType: string

  @ApiModelProperty({ example: 'answerValue' })
  public readonly answerValue: string
}
