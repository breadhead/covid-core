import { ApiModelProperty } from '@nestjs/swagger'

import QuotaResponse from './QuotaResponse'

const exampleSource = { id: '123ffdsf4jhj', name: 'Рак молочной железы, Кемеровская область', count: 11 }
const exampleTarget = { id: 'jkhgd434kkkk', name: 'Общая квота', count: 10001 }

export default class QuotaTransferResponse {
  @ApiModelProperty({ example: exampleSource })
  public readonly source: QuotaResponse

  @ApiModelProperty({ example: exampleTarget })
  public readonly target: QuotaResponse
}
