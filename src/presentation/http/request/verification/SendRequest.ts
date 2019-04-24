import { ApiModelProperty } from '@nestjs/swagger'
import { IsMobilePhone, MaxLength, MinLength } from 'class-validator'

export default class SendRequest {
  @ApiModelProperty({ example: '+7999464321' })
  public readonly number: string
}
