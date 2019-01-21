import User from '@app/domain/user/User.entity'
import { ApiModelProperty } from '@nestjs/swagger'

export default class CurrentUserResponse {
  public static fromUser(user: User) {
    return { roles: user.roles }
  }

  @ApiModelProperty({ example: ['admin', 'case'] })
  public readonly roles: string[]
}
