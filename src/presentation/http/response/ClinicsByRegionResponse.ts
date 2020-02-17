import { ApiModelProperty } from '@nestjs/swagger'

export default class ClinicsByRegionResponse {
  @ApiModelProperty({ example: 'В вашем регионе' })
  public readonly title: string

  @ApiModelProperty({
    example: ['областная больница', 'онкологическая больница ГБУЗ'],
  })
  public readonly children: string[]
}
