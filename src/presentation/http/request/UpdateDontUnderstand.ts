import { ApiModelProperty } from '@nestjs/swagger'
import { DontUnderstandEnum } from './../../../../src/domain/claim/DontUnderstandEnum'

export default class UpdateDontUnderstand {
  @ApiModelProperty({ example: 'jkjhhjhj34' })
  public readonly claimId: string

  @ApiModelProperty({ example: DontUnderstandEnum.DEFAULT })
  public readonly newStatus: DontUnderstandEnum
}
