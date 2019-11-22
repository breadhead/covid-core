import { ApiModelProperty } from '@nestjs/swagger'

export default class AddStoryPhoneRequest {
  @ApiModelProperty({ example: 'jkjhhjhj34' })
  public readonly claimId: string

  @ApiModelProperty({ example: '8 800 999 77 88' })
  public readonly phone: string
}
