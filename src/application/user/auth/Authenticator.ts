import { Inject, Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'

import NenaprasnoBackendClient, {
  EMAIL_IS_ALREADY_TAKEN,
} from '@app/infrastructure/Nenaprasno/NenaprasnoBackendClient'
import TokenPayload from '@app/infrastructure/security/TokenPayload'

import InvalidCredentialsException from '../../exception/InvalidCredentialsException'
import SignInProvider, { SignInProviders } from './providers/SignInProvider'
import tokenFromUser from './tokenFromUser'
import { UserRepository } from '@app/user/service/UserRepository'
import { User } from '@app/user/model/User.entity'
import { UserCreator } from '@app/user/application/UserCreator'

interface SignUpResult {
  token: string
  user: User
}

@Injectable()
export default class Authenticator {
  constructor(
    @Inject(SignInProviders) private readonly signInProviders: SignInProvider[],
    private readonly userRepo: UserRepository,
    private readonly nenaprasno: NenaprasnoBackendClient,
    private readonly jwtService: JwtService,
    private readonly userCreator: UserCreator,
  ) {}

  public async signIn(login: string, credential: string): Promise<string> {
    // We must use await in loop to execute providers sequentially

    let user: User | null
    for (const provider of this.signInProviders) {
      // eslint-disable-next-line no-await-in-loop
      const supports = await provider.supports(login, credential)
      if (supports) {
        // eslint-disable-next-line no-await-in-loop
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
    try {
      const id = await this.nenaprasno.signUp(login, password, confirm)
      const token = await this.signIn(login, password)
      const cabinetUser = await this.userRepo.findOneByCabinetId(id)
      return { token, user: cabinetUser }
    } catch (e) {
      if (e.message.includes(EMAIL_IS_ALREADY_TAKEN)) {
        const internalUser = await this.userRepo.findOneByContactEmail(login)
        if (!!internalUser) {
          const token = await this.signIn(login, password)

          return { token, user: internalUser }
        }
        const newUser = await this.userCreator.createInternalClient(
          login,
          password,
        )
        const token = await this.signIn(login, password)
        return { token, user: newUser }
      }

      throw e
    }
  }

  public async validateUser(token: TokenPayload): Promise<User | null> {
    const user = await this.userRepo.findOne(token.login)

    // TODO: check user is blocked

    return user
  }
}
