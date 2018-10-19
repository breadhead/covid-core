import { ApiModelProperty } from '@nestjs/swagger'

import QuotaRequest, { exampleQuotaRequest } from './QuotaRequest'

export default class QuotaCreateRequest {
  @ApiModelProperty({ example: 12 })
  public readonly count: number

  @ApiModelProperty({ example: exampleQuotaRequest })
  public readonly quota: QuotaRequest
}
