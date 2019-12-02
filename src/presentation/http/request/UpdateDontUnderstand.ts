import { ApiModelProperty } from '@nestjs/swagger'
import { DontUnderstandEnum } from './../../../../src/domain/claim/DontUnderstandEnum'

export default class UpdateDontUnderstandRequest {
  @ApiModelProperty({ example: 'jkjhhjhj34' })
  public readonly id: string

  @ApiModelProperty({ example: DontUnderstandEnum.DEFAULT })
  public readonly status: DontUnderstandEnum
}
