import { ApiModelProperty } from '@nestjs/swagger'

export default class SendRequest {
  @ApiModelProperty({ example: '+7999464321' })
  public readonly number: string
}
