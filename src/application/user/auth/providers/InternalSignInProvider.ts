import { Injectable } from '@nestjs/common'

import InvalidCredentialsException from '@app/application/exception/InvalidCredentialsException'
import { User } from '@app/user/model/User.entity'
import { PasswordEncoder } from '@app/utils/service/PasswordEncoder/PasswordEncoder'
import { UserRepository } from '@app/user/service/UserRepository'

import SignInProvider from './SignInProvider'

@Injectable()
export default class InternalSignInProvider implements SignInProvider {
  public constructor(
    private readonly userRepo: UserRepository,
    private readonly encoder: PasswordEncoder,
  ) {}

  public async supports(login: string): Promise<boolean> {
    const user = await this.userRepo.findOne(login)

    if (!user) {
      return false
    }

    return user.passwordCredentials.nonEmpty()
  }

  public async signIn(login: string, password: string): Promise<User> {
    const user = await this.userRepo.getOne(login)

    const valid = await user.passwordCredentials
      .map(userCredentials => userCredentials.password)
      .map(encodedPassword =>
        this.encoder.isPasswordValid(encodedPassword, password),
      )
      .getOrElse(Promise.resolve(false))

    if (!valid) {
      throw new InvalidCredentialsException({ login, password })
    }

    return user
  }
}
