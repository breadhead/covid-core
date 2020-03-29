import { User } from '@app/user/model/User.entity'
import { ApiModelProperty } from '@nestjs/swagger'

export default class CurrentUserResponse {
  public static fromUser(user: User) {
    let email = validateEmail(user.login) ? user.login : null;

    if (!email) {
      email = user.contacts.email || null;
    }

    return { roles: user.roles, login: user.login, email: email }
  }

  @ApiModelProperty({ example: ['admin', 'case-manager'] })
  public readonly roles: string[]

  @ApiModelProperty({ example: 'petrov@meme.com' })
  public readonly login: string

  @ApiModelProperty({ example: 'petrov@meme.com'})
  public readonly email?: string;
}

function validateEmail(email):boolean {
  const mask = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  return mask.test(String(email).toLowerCase());
}
