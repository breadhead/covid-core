import { ApiModelProperty } from '@nestjs/swagger'

export default class QuotaEditRequest {
  @ApiModelProperty({ example: 'fdfd' })
  public readonly id: string

  @ApiModelProperty({ example: 'Сотрудники ПАО Сбербанк' })
  public readonly name: string

  @ApiModelProperty({ example: 12 })
  public readonly count: number
}
