import { ApiModelProperty } from '@nestjs/swagger'

import Message from '@app/domain/claim/Message.entity'

export default class ChatMessageResponse {
  public static fromEntity(message: Message) {
    return {
      id: message.id,
      content: message.content,
      date: message.date,
    } as ChatMessageResponse
  }

  @ApiModelProperty({ example: 'fdsfdhsk' })
  public readonly id: string

  @ApiModelProperty({ example: 'Hello, world!' })
  public readonly content: string

  @ApiModelProperty({ example: new Date() })
  public readonly date: Date

  // TODO: Add user field
}
