import { ApiModelProperty } from '@nestjs/swagger'

export default class BindQuotaRequest {
  @ApiModelProperty({ example: 'jkjhhjhj34' })
  public readonly quotaId: string

  @ApiModelProperty({ example: 'jgfjyj66fhgf' })
  public readonly claimId: string
}
