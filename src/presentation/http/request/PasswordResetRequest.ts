import { ApiModelProperty } from '@nestjs/swagger'

export class PasswordResetRequest {
  @ApiModelProperty({ example: 'kate@gmail.com' })
  public readonly login: string
}
