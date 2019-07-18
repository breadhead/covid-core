import { ApiModelProperty } from '@nestjs/swagger'

export default class LoginRequest {
  @ApiModelProperty({ example: 'kate@gmail.com' })
  public readonly login: string

  @ApiModelProperty({ example: '268890' })
  public readonly password: string
}
