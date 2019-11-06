import { ApiModelProperty } from '@nestjs/swagger'
import { StoryEnum } from '@app/domain/story/StoryEnum'

export default class StoryAddPhoneRequest {
  @ApiModelProperty({ example: '01TxsTyJaSGsC6' })
  public readonly claimId: string

  @ApiModelProperty({ example: '88008888383' })
  public readonly phone: string

  @ApiModelProperty({ example: 'Не звонили' })
  public readonly status: StoryEnum
}
