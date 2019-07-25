import { ApiModelProperty } from '@nestjs/swagger'

export class FunnelClaimsResponse {
  @ApiModelProperty({ example: 1000 })
  public readonly shortClaims: number

  @ApiModelProperty({ example: 900 })
  public readonly situationClaims: number

  @ApiModelProperty({ example: 800 })
  public readonly finishedClaims: number

  @ApiModelProperty({ example: 500 })
  public readonly sendedToClientClaims: number

  @ApiModelProperty({ example: 300 })
  public readonly successfullyClosedClaims: number
}
