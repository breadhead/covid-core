import { ApiModelProperty } from '@nestjs/swagger'

export default class VerificateRequest {
  @ApiModelProperty({ example: '123456' })
  public readonly code: string
}
