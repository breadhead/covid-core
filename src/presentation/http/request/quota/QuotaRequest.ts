import { ApiModelProperty } from '@nestjs/swagger'

export const exampleQuotaRequest = {
  name: 'Сотрудники ПАО Сбербанк',
  companyName: 'Сбербанк',
  companyLogoUrl: '/path/to/logo.png',
  companyLink: 'google.com',
  constraints: ['рак молочной железы'],
  corporate: true,
  publicCompany: true,
  comment: 'Любой коментарий',
  companyComment: 'Комментарий для компании',
}

export default class QuotaRequest {
  @ApiModelProperty({ example: exampleQuotaRequest.name })
  public readonly name: string

  @ApiModelProperty({ example: exampleQuotaRequest.companyName, required: false })
  public readonly companyName?: string

  @ApiModelProperty({ example: exampleQuotaRequest.companyLogoUrl, required: false })
  public readonly companyLogoUrl?: string

  @ApiModelProperty({ example: exampleQuotaRequest.companyLink, required: false })
  public readonly companyLink?: string

  @ApiModelProperty({ example: exampleQuotaRequest.constraints })
  public readonly constraints: string[]

  @ApiModelProperty({ example: exampleQuotaRequest.corporate, default: false, required: false })
  public readonly corporate?: boolean = false

  @ApiModelProperty({ example: exampleQuotaRequest.publicCompany, default: false, required: false })
  public readonly publicCompany?: boolean = false

  @ApiModelProperty({ example: exampleQuotaRequest.companyComment, required: false })
  public readonly companyComment?: string

  @ApiModelProperty({ example: exampleQuotaRequest.comment, required: false })
  public readonly comment?: string
}
