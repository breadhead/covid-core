import { DontUnderstandEnum } from '@app/domain/claim/DontUnderstandEnum'
import { ApiModelProperty } from '@nestjs/swagger'

export default class UpdateDontUnderstandRequest {
  @ApiModelProperty({ example: 'jkjhhjhj34' })
  public readonly id: string

  @ApiModelProperty({ example: DontUnderstandEnum.DEFAULT })
  public readonly status: DontUnderstandEnum
}
