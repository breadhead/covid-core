import { ApiModelProperty } from '@nestjs/swagger'

export default class BindQuotaRequest {
  @ApiModelProperty({ example: { name: 'Petro', age: 12 } })
  public readonly quotaId: string
  public readonly claimId: string
}
