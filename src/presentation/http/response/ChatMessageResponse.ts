import { ApiModelProperty } from '@nestjs/swagger'

import Message from '@app/domain/claim/Message.entity'
import { Role } from '@app/user/model/Role'
import { User } from '@app/user/model/User.entity'
import TokenPayload from '@app/infrastructure/security/TokenPayload'

enum Author {
  Client = 'Клиент',
  Doctor = 'Эксперт',
  CaseManager = 'Специалист',
  Unknown = 'Неизвестный',
}

const defineAuthor = (
  requester: TokenPayload,
  author: User,
): Author | undefined => {
  if (requester.login === author.login) {
    return undefined
  }

  if (author.roles.includes(Role.Client)) {
    return Author.Client
  }

  if (author.roles.includes(Role.Doctor)) {
    return Author.Doctor
  }

  if (author.roles.includes(Role.CaseManager)) {
    return Author.CaseManager
  }

  return Author.Unknown
}

export default class ChatMessageResponse {
  public static fromEntity = (user: TokenPayload) => (message: Message) => {
    return {
      id: message.id,
      content: message.content,
      date: message.date,
      author: defineAuthor(user, message.user),
    } as ChatMessageResponse
  }

  @ApiModelProperty({ example: 'fdsfdhsk' })
  public readonly id: string

  @ApiModelProperty({ example: 'Hello, world!' })
  public readonly content: string

  @ApiModelProperty({ example: new Date() })
  public readonly date: Date

  @ApiModelProperty({
    example: Author.CaseManager,
    required: false,
    enum: Object.values(Author),
  })
  public readonly author?: Author
}
