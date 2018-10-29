import { ApiModelProperty } from '@nestjs/swagger'

class QuotaIncomeRequest {
  @ApiModelProperty({ example: 543513514 })
  public readonly amount: number

  @ApiModelProperty({ example: 'sdjkfshfgd76675764' })
  public readonly quotaId: string
}

export default QuotaIncomeRequest
