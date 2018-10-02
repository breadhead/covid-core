import { ApiModelProperty } from '@nestjs/swagger'

export default class LoginRequest {
  @ApiModelProperty({ example: 'kate@gmail.com' })
  public readonly login: string

  @ApiModelProperty({ example: 'hfdsh565)hk' })
  public readonly password: string
}
