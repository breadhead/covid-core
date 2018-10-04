import { ApiModelProperty } from '@nestjs/swagger'

import Quota from '@app/domain/quota/Quota.entity'

export default class QuotaResponse {
  public static fromEntity(quota: Quota) {
    return {
      id: quota.id,
      name: quota.name,
      count: quota.balance,
    } as QuotaResponse
  }

  @ApiModelProperty({ example: 45 })
  public readonly id: number

  @ApiModelProperty({ example: 'Рак молочной железы, Кемеровская область' })
  public readonly name: string

  @ApiModelProperty({ example: 1000 })
  public readonly count: number
}
