import { ApiModelProperty } from '@nestjs/swagger'

import { CorporateStatus } from '@app/domain/claim/CorporateStatus'

export default class ChangeCorporateStatusRequest {
  @ApiModelProperty({ example: 'jkjhhjhj34' })
  public readonly claimId: string

  @ApiModelProperty({ example: CorporateStatus.Ok })
  public readonly newStatus: CorporateStatus
}
