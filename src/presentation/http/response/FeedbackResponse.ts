import { ApiModelProperty } from '@nestjs/swagger'

export default class FeedbackResponse {
  @ApiModelProperty({ example: true })
  public readonly status: boolean
}
