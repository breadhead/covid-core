import { Injectable } from '@nestjs/common'

import InvalidCredentialsException from '@app/application/exception/InvalidCredentialsException'
import { User } from '@app/user/model/User.entity'
import { PasswordEncoder } from '@app/utils/service/PasswordEncoder/PasswordEncoder'
import { UserRepository } from '@app/user/service/UserRepository'

import SignInProvider from './SignInProvider'

@Injectable()
export default class ResetedSignInProvider implements SignInProvider {
  public constructor(
    private readonly userRepo: UserRepository,
    private readonly encoder: PasswordEncoder,
  ) {}

  public async supports(email: string): Promise<boolean> {
    const user = await this.userRepo.findOneByContactEmail(email)

    if (!user) {
      return false
    }

    return user.passwordCredentials.nonEmpty()
  }

  public async signIn(email: string, password: string): Promise<User> {
    const user = await this.userRepo.getOneByContactEmail(email)

    const valid = await user.passwordCredentials
      .map(userCredentials => userCredentials.password)
      .map(encodedPassword =>
        this.encoder.isPasswordValid(encodedPassword, password),
      )
      .getOrElse(Promise.resolve(false))

    if (!valid) {
      throw new InvalidCredentialsException({ email, password })
    }

    return user
  }
}
