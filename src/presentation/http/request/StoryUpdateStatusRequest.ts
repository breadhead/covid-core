import { ApiModelProperty } from '@nestjs/swagger'
import { StoryEnum } from '@app/domain/story/StoryEnum'

export default class StoryUpdateStatusRequest {
  @ApiModelProperty({ example: '01TxsTyJaSGsC6' })
  public readonly id: string

  @ApiModelProperty({ example: 'Звонили' })
  public readonly status: StoryEnum
}
