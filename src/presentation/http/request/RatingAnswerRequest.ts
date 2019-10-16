import { ApiModelProperty } from '@nestjs/swagger'

export default class RatingAnswerRequest {
  @ApiModelProperty({ example: 1 })
  public readonly id: number

  @ApiModelProperty({ example: 'new answer' })
  public readonly text: string
}
