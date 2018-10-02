import { ApiModelProperty } from '@nestjs/swagger'

export default class ClientResponse {
  @ApiModelProperty({ example: 'gjkfdhg34kJK' })
  public readonly id: string

  @ApiModelProperty({ example: 'pert@sergeevich.me' })
  public readonly email: string

  @ApiModelProperty({ required: false, example: '79999999999' })
  public readonly phone?: string
}
