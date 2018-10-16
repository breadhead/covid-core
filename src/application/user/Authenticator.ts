import { Inject, Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { InjectRepository } from '@nestjs/typeorm'

import UserRepository from '@app/domain/user/UserRepository'
import PasswordEncoder,
{ PasswordEncoder as PasswordEncoderSymbol } from '@app/infrastructure/PasswordEncoder/PasswordEncoder'
import TokenPayload from '@app/infrastructure/security/TokenPayload'

import InvalidCredentialsException from '../exception/InvalidCredentialsException'

@Injectable()
export default class Authenticator {
  constructor(
    @InjectRepository(UserRepository) private readonly userRepo: UserRepository,
    @Inject(PasswordEncoderSymbol) private readonly encoder: PasswordEncoder,
    private readonly jwtService: JwtService,
  ) {}

  public async signIn(login: string, password: string): Promise<string> {
    const user = await this.userRepo.getOne(login)

    const valid = await user.passwordCredentials
      .map((userCredentials) => userCredentials.password)
      .map((encodedPassword) => this.encoder.isPasswordValid(encodedPassword, password))
      .getOrElse(Promise.resolve(false))

    if (!valid) {
      throw new InvalidCredentialsException({ login, password })
    }

    const payload: TokenPayload = { login: user.login }

    return this.jwtService.sign(payload)
  }

  public async validateUser(token: string): Promise<TokenPayload | null> {
    const payload = this.jwtService.verify<TokenPayload>(token, {})

    const user = await this.userRepo.findOne(payload.login)

    // TODO: check user is blocked

    return Promise.resolve(payload)
  }
}
