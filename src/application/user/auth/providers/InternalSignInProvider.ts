import { Inject, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'

import InvalidCredentialsException from '@app/application/exception/InvalidCredentialsException'
import UserRepository from '@app/domain/user/UserRepository'
import PasswordEncoder,
{ PasswordEncoder as PasswordEncoderSymbol } from '@app/infrastructure/PasswordEncoder/PasswordEncoder'
import TokenPayload from '@app/infrastructure/security/TokenPayload'

import SignInProvider from './SignInProvider'

@Injectable()
export default class InternalSignInProvider implements SignInProvider {
  public constructor(
    @InjectRepository(UserRepository) private readonly userRepo: UserRepository,
    @Inject(PasswordEncoderSymbol) private readonly encoder: PasswordEncoder,
  ) {}

  public async supports(login: string): Promise<boolean> {
    const user = await this.userRepo.getOne(login)

    return user.passwordCredentials.nonEmpty()
  }

  public async signIn(login: string, password: string): Promise<TokenPayload> {
    const user = await this.userRepo.getOne(login)

    const valid = await user.passwordCredentials
      .map((userCredentials) => userCredentials.password)
      .map((encodedPassword) => this.encoder.isPasswordValid(encodedPassword, password ))
      .getOrElse(Promise.resolve(false))

    if (!valid) {
      throw new InvalidCredentialsException({ login, password })
    }

    const payload: TokenPayload = { login: user.login }

    return payload
  }
}
