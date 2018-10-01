import { ApiModelProperty } from '@nestjs/swagger'

export default class QutaTransferRequest {

  @ApiModelProperty({ example: 'fdsjfhsdk123' })
  public readonly sourceId: string

  @ApiModelProperty({ example: 'dsdgfJjhff3f' })
  public readonly targetId: string

  @ApiModelProperty({ example: 12 })
  public readonly count: number
}
