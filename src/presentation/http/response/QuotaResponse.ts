import { ApiModelProperty } from '@nestjs/swagger'

import Quota, { QuotaType } from '@app/domain/quota/Quota.entity'

import CompanyResponse, { exampleCompanyResponse } from './CompanyResponse'

export default class QuotaResponse {
  public static fromEntity(quota: Quota) {
    return {
      id: quota.id,
      name: quota.name,
      count: quota.balance,
      company: quota.company ? CompanyResponse.fromEntity(quota.company) : undefined,
      type: quota.type,
      constraints: quota.constraints,
      publicCompany: quota.publicCompany,
      comment: quota.comment,
    } as QuotaResponse
  }

  @ApiModelProperty({ example: 'fdsf34' })
  public readonly id: string

  @ApiModelProperty({ example: 'Рак молочной железы, Кемеровская область' })
  public readonly name: string

  @ApiModelProperty({ example: 1000 })
  public readonly count: number

  @ApiModelProperty({ example: exampleCompanyResponse, required: false })
  public readonly company?: CompanyResponse

  @ApiModelProperty({ example: QuotaType.Special, enum: Object.values(QuotaType) })
  public readonly type: QuotaType

  @ApiModelProperty({ example: ['Красноярский край'] })
  public readonly constraints: string[]

  @ApiModelProperty({ example: true })
  public readonly publicCompany: boolean

  @ApiModelProperty({ example: 'Любой контейнер' })
  public readonly comment: string
}
