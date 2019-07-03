/* eslint-disable max-classes-per-file */

import { ApiModelProperty } from '@nestjs/swagger'

class DoctorStat {
  @ApiModelProperty({ example: 'Шило' })
  public readonly name: string

  @ApiModelProperty({ example: 21321 })
  public readonly median: number

  @ApiModelProperty({ example: 21321 })
  public readonly average: number

  @ApiModelProperty({ example: 21321 })
  public readonly min: number

  @ApiModelProperty({ example: 21321 })
  public readonly max: number
}

export class DoctorAnswerTimeResponse {
  @ApiModelProperty({ example: 21321 })
  public readonly median: number

  @ApiModelProperty({ example: 21321 })
  public readonly average: number

  @ApiModelProperty({ example: 21321 })
  public readonly min: number

  @ApiModelProperty({ example: 21321 })
  public readonly max: number

  @ApiModelProperty({ example: [] })
  public readonly doctors: DoctorStat[]
}
