import { ApiModelProperty } from '@nestjs/swagger'

export class FunnelClaimsResponse {
  @ApiModelProperty({ example: 'funnel-stuff' })
  public readonly funnel: any
}
