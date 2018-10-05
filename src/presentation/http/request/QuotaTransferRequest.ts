import { ApiModelProperty } from '@nestjs/swagger'

export default class QutaTransferRequest {

  @ApiModelProperty({ example: 'fsdfsdf' })
  public readonly sourceId: string

  @ApiModelProperty({ example: 'fdfsd' })
  public readonly targetId: string

  @ApiModelProperty({ example: 12 })
  public readonly count: number
}
