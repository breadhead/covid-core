import { ApiModelProperty } from '@nestjs/swagger'

export default class RegistrationRequest {
  @ApiModelProperty({ example: 'kate@gmail.com' })
  public readonly email: string

  @ApiModelProperty({ required: false, example: '79999999999' })
  public readonly phone?: string

  @ApiModelProperty({ example: 'password' })
  public readonly password: string

  @ApiModelProperty({ example: 'password' })
  public readonly confirm: string
}
