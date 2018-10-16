import { Inject, Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { InjectRepository } from '@nestjs/typeorm'

import UserRepository from '@app/domain/user/UserRepository'
import TokenPayload from '@app/infrastructure/security/TokenPayload'

import InternalSignInProvider from './providers/InternalSignInProvider'
import SignInProvider, { SignInProviders } from './providers/SignInProvider'

@Injectable()
export default class Authenticator {
  constructor(
    @InjectRepository(UserRepository) private readonly userRepo: UserRepository,
    @Inject(SignInProviders) private readonly signInProviders: SignInProvider[],
    private readonly jwtService: JwtService,
  ) { }

  public async signIn(login: string, credential: string): Promise<string> {
    let payload: TokenPayload
    for (const provider of this.signInProviders) {
      const supports = await provider.supports(login)
      if (supports) {
        payload = await provider.signIn(login, credential)
        break
      }
    }

    if (!payload) {
      throw Error() // TODO: specific
    }

    return this.jwtService.sign(payload)
  }

  public async validateUser(token: string): Promise<TokenPayload | null> {
    const payload = this.jwtService.verify<TokenPayload>(token, {})

    const user = await this.userRepo.findOne(payload.login)

    // TODO: check user is blocked

    return Promise.resolve(payload)
  }
}
