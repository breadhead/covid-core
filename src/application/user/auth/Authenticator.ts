import { Inject, Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { InjectRepository } from '@nestjs/typeorm'

import User from '@app/domain/user/User.entity'
import UserRepository from '@app/domain/user/UserRepository'
import NenaprasnoBackendClient from '@app/infrastructure/Nenaprasno/NenaprasnoBackendClient'
import TokenPayload from '@app/infrastructure/security/TokenPayload'

import InvalidCredentialsException from '../../exception/InvalidCredentialsException'
import SignInProvider, { SignInProviders } from './providers/SignInProvider'
import tokenFromUser from './tokenFromUser'

interface SignUpResult {
  token: string
  user: User
}

@Injectable()
export default class Authenticator {
  constructor(
    @InjectRepository(UserRepository) private readonly userRepo: UserRepository,
    @Inject(SignInProviders) private readonly signInProviders: SignInProvider[],
    private readonly nenaprasno: NenaprasnoBackendClient,
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

  public async signUp(
    login: string,
    password: string,
    confirm: string,
  ): Promise<SignUpResult> {
    const id = await this.nenaprasno.signUp(login, password, confirm)

    if (!id) {
      throw new InvalidCredentialsException({ login, password, confirm })
    }

    const token = await this.signIn(login, password)
    const user = await this.userRepo.findOneByCabinetId(id)

    return { token, user }
  }

  public async validateUser(token: TokenPayload): Promise<User | null> {
    const user = await this.userRepo.findOne(token.login)

    // TODO: check user is blocked

    return user
  }
}
