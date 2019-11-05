import { ApiModelProperty } from '@nestjs/swagger'

export default class StoryAddPhoneRequest {
  @ApiModelProperty({ example: '01TxsTyJaSGsC6' })
  public readonly claimId: string

  @ApiModelProperty({ example: '88008888383' })
  public readonly phone: string

  @ApiModelProperty({ example: 'Не звонили' })
  public readonly status: string
}
