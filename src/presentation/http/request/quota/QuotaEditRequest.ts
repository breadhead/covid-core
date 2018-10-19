import { ApiModelProperty } from '@nestjs/swagger'

import QuotaRequest, { exampleQuotaRequest } from './QuotaRequest'

export default class QuotaEditRequest {
  @ApiModelProperty({ example: 'ds' })
  public readonly id: string

  @ApiModelProperty({ example: exampleQuotaRequest })
  public readonly quota: QuotaRequest
}
