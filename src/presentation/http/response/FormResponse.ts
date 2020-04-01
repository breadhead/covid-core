import { ApiModelProperty } from '@nestjs/swagger'

export default class FormResponse {
  @ApiModelProperty({ example: 12 })
  public readonly id: number
}
