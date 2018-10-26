import { ApiModelProperty } from '@nestjs/swagger'

class QuotaIncomeRequest {
  @ApiModelProperty({ example: 543513514 })
  public readonly amount: number

  @ApiModelProperty({ example: 'Apple Inc' })
  public readonly companyName: string

  @ApiModelProperty({ example: 'sdjkfshfgd76675764' })
  public readonly quotaId: string
}

export default QuotaIncomeRequest
