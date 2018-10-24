import { ApiModelProperty } from '@nestjs/swagger'

import { CloseType } from '@app/application/claim/CloseClaimCommand'

export default class CloseClaimRequest {
  @ApiModelProperty({ example: 'dsfdsf34' })
  public readonly id: string

  @ApiModelProperty({ example: CloseType.Successful, enum: Object.values(CloseType) })
  public readonly type: CloseType

  @ApiModelProperty({ example: true })
  public readonly deallocateQuota: boolean
}
