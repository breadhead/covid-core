import { ApiModelProperty } from '@nestjs/swagger'

export const exampleClient = {
  id: 'gjkfdhg34kJK',
  email: 'pert@sergeevich.me',
  phone: '79999999999',
}

export default class ClientData {
  @ApiModelProperty({ example: exampleClient.id })
  public readonly id: string

  @ApiModelProperty({ example: exampleClient.email })
  public readonly email: string

  @ApiModelProperty({ required: false, example: exampleClient.phone })
  public readonly phone?: string
}
