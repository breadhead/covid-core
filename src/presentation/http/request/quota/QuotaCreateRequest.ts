import { ApiModelProperty } from '@nestjs/swagger'

export default class QuotaCreateRequest {
  @ApiModelProperty({ example: 'Сотрудники ПАО Сбербанк' })
  public readonly name: string

  @ApiModelProperty({ example: 12 })
  public readonly count: number

  @ApiModelProperty({ example: 'Сбербанк', required: false })
  public readonly companyName: string
}
