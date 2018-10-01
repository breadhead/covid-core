import { ApiModelProperty } from '@nestjs/swagger'

export default class QuotaCreateRequest {
  @ApiModelProperty({ example: 'fdsf344JJ' })
  public readonly id: string

  @ApiModelProperty({ example: 'Сотрудники ПАО Сбербанк' })
  public readonly name: string

  @ApiModelProperty({ example: 12 })
  public readonly count: number
}
