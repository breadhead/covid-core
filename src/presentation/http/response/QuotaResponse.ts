import { ApiModelProperty } from '@nestjs/swagger'

export default class QuotaResponse {

  @ApiModelProperty({ example: 's12jHH-23Hjfpk4' })
  public readonly id: string

  @ApiModelProperty({ example: 'Рак молочной железы, Кемеровская область' })
  public readonly name: string

  @ApiModelProperty({ example: 1000 })
  public readonly count: number
}
