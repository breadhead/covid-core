import { User } from '@app/user/model/User.entity'
import { ApiModelProperty } from '@nestjs/swagger'

export default class CurrentUserResponse {
  public static fromUser(user: User) {
    return { roles: user.roles, login: user.login }
  }

  @ApiModelProperty({ example: ['admin', 'case-manager'] })
  public readonly roles: string[]

  @ApiModelProperty({ example: 'petrov@meme.con' })
  public readonly login: string
}
