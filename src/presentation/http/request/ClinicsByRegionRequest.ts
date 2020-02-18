import { ApiModelProperty } from '@nestjs/swagger'

export default class ClinicsByRegionRequest {
  @ApiModelProperty({ example: 'Архангельская область' })
  public readonly region: string

  @ApiModelProperty({ example: 'областная больница' })
  public readonly name: string
}
