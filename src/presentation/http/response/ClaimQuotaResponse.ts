import { ApiModelProperty } from '@nestjs/swagger'

import Quota from '@app/domain/quota/Quota.entity'

export default class ClaimQuotaResponse {
  public static fromEntity(quota: Quota): ClaimQuotaResponse {
    if (!quota) {
      return {
        empty: true,
      }
    }

    const { company, name, comment } = quota

    if (!company) {
      return {
        name,
        comment,
      }
    }

    const { logo, site } = company

    return {
      name,
      comment,
      logo,
      site,
      companyName: company.name,
    }
  }

  @ApiModelProperty({ example: false, required: false })
  public readonly empty?: boolean

  @ApiModelProperty({ example: 'Google quota' })
  public readonly name?: string

  @ApiModelProperty({ example: 'Google' })
  public readonly companyName?: string

  @ApiModelProperty({ example: 'Гуляем на деньги гугла' })
  public readonly comment?: string

  @ApiModelProperty({ example: '/google.jpg' })
  public readonly logo?: string

  @ApiModelProperty({ example: 'https://google.com' })
  public readonly site?: string
}
