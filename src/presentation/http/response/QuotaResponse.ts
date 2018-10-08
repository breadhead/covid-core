import { ApiModelProperty } from '@nestjs/swagger'

import Quota from '@app/domain/quota/Quota.entity'

import CompanyResponse, { exampleCompanyResponse } from './CompanyResponse'

export default class QuotaResponse {
  public static fromEntity(quota: Quota) {
    return {
      id: quota.id,
      name: quota.name,
      count: quota.balance,
      company: quota.company ? CompanyResponse.fromEntity(quota.company) : undefined,
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
}
