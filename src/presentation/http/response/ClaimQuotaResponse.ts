import { ApiModelProperty } from '@nestjs/swagger'

import Quota from '@app/domain/quota/Quota.entity'

export default class ClaimQuotaResponse {
  public static fromEntity(quota: Quota): ClaimQuotaResponse {
    if (!quota) {
      return {
        empty: true,
      }
    }

    const { company } = quota

    if (!company) {
      return {}
    }

    const { name, logo, site, comment } = company

    return {
      name,
      comment,
      logo,
      site,
    }
  }

  @ApiModelProperty({ example: false, required: false })
  public readonly empty?: boolean

  @ApiModelProperty({ example: 'Google' })
  public readonly name?: string

  @ApiModelProperty({ example: 'Гуляем на деньги гугла' })
  public readonly comment?: string

  @ApiModelProperty({ example: '/google.jpg' })
  public readonly logo?: string

  @ApiModelProperty({ example: 'https://google.com' })
  public readonly site?: string
}
