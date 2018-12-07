import { Inject, Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { InjectRepository } from '@nestjs/typeorm'

import User from '@app/domain/user/User.entity'
import UserRepository from '@app/domain/user/UserRepository'
import TokenPayload from '@app/infrastructure/security/TokenPayload'

import InvalidCredentialsException from '../../exception/InvalidCredentialsException'
import SignInProvider, { SignInProviders } from './providers/SignInProvider'
import tokenFromUser from './tokenFromUser'

@Injectable()
export default class Authenticator {
  constructor(
    @InjectRepository(UserRepository) private readonly userRepo: UserRepository,
    @Inject(SignInProviders) private readonly signInProviders: SignInProvider[],
    private readonly jwtService: JwtService,
  ) {}

  public async signIn(login: string, credential: string): Promise<string> {
    let user: User | null
    for (const provider of this.signInProviders) {
      const supports = await provider.supports(login, credential)
      if (supports) {
        user = await provider.signIn(login, credential)
        break
      }
    }

    if (!user) {
      throw new InvalidCredentialsException({ login, password: credential })
    }

    const payload = tokenFromUser(user)

    return this.jwtService.sign(payload)
  }

  public async validateUser(token: TokenPayload): Promise<User | null> {
    const user = await this.userRepo.findOne(token.login)

    // TODO: check user is blocked

    return user
  }
}
