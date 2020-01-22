/* eslint-disable max-classes-per-file */

import { ApiModelProperty } from '@nestjs/swagger'

export class DoctorReportResponse {
  @ApiModelProperty({ example: 21321 })
  public readonly median: number

  @ApiModelProperty({ example: 21321 })
  public readonly average: number

  @ApiModelProperty({ example: 21321 })
  public readonly min: number

  @ApiModelProperty({ example: 21321 })
  public readonly max: number

  @ApiModelProperty({ example: 21321 })
  public readonly success: number

  @ApiModelProperty({ example: 21321 })
  public readonly failure: number

  @ApiModelProperty({ example: 33 })
  public readonly closedByClient: number

  @ApiModelProperty({ example: 3837 })
  public readonly all: number

  @ApiModelProperty({ example: 3837 })
  public readonly ratingAverage: number

  @ApiModelProperty({ example: 3837 })
  public readonly ratingMedian: number
}
