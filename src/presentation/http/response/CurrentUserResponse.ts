import User from '@app/domain/user/User.entity'
import { ApiModelProperty } from '@nestjs/swagger'

export default class CurrentUserResponse {
  public static fromUser(user: User) {
    const trusted = user.isClient ? user.valid : true

    return { roles: user.roles, trusted }
  }

  @ApiModelProperty({ example: ['admin', 'case'] })
  public readonly roles: string[]

  @ApiModelProperty({ example: true })
  public readonly trusted: boolean
}
