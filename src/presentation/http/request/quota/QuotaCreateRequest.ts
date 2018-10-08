import { ApiModelProperty } from '@nestjs/swagger'

export default class QuotaCreateRequest {
  @ApiModelProperty({ example: 'Сотрудники ПАО Сбербанк' })
  public readonly name: string

  @ApiModelProperty({ example: 12 })
  public readonly count: number

  @ApiModelProperty({ example: 'Сбербанк', required: false })
  public readonly companyName: string

  @ApiModelProperty({ example: ['рак молочной железы'] })
  public readonly constraints: string[]

  @ApiModelProperty({ example: true, default: false, required: false })
  public readonly corporate?: boolean = false

  @ApiModelProperty({ example: true, default: false, required: false })
  public readonly publicCompany?: boolean = false

  @ApiModelProperty({ example: 'Любой коментарий', required: false })
  public readonly comment?: string
}
