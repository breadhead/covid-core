import { ApiModelProperty } from '@nestjs/swagger'

export default class QutaTransferRequest {

  @ApiModelProperty({ example: 13 })
  public readonly sourceId: number

  @ApiModelProperty({ example: 14 })
  public readonly targetId: number

  @ApiModelProperty({ example: 12 })
  public readonly count: number
}
