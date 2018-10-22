import { ApiModelProperty } from '@nestjs/swagger'
import { MinLength, MaxLength, IsMobilePhone,  } from "class-validator";


export default class SendRequest {
  @ApiModelProperty({ example: '+7999464321' })
  @IsMobilePhone("ru-RU")
  public readonly number: string
}
