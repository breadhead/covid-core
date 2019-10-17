import { ApiModelProperty } from '@nestjs/swagger'

export default class RatingAnswerRequest {
  @ApiModelProperty({ example: 1 })
  public readonly id: number

  @ApiModelProperty({ example: 'question' })
  public readonly question: string

  @ApiModelProperty({ example: 'answer' })
  public readonly answer: string
}
