/* eslint-disable max-classes-per-file */

import { ApiModelProperty } from '@nestjs/swagger'

export class DoctorRatingResponse {
  @ApiModelProperty({ example: 'Павлова' })
  public readonly doctor: string

  @ApiModelProperty({ example: 21321 })
  public readonly ratingAverage: number

  @ApiModelProperty({ example: 21321 })
  public readonly ratingMedian: number
}
