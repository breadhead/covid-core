import { ApiModelProperty } from '@nestjs/swagger'

export default class ChatMessageRequest {
  @ApiModelProperty({ example: 'fdsjhfsdlk' })
  public readonly id: string

  @ApiModelProperty({ example: 'Hello, World!' })
  public readonly content: string

  @ApiModelProperty({ example: new Date() })
  public readonly date: Date
}
