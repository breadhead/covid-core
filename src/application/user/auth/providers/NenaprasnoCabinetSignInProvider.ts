import { Injectable } from '@nestjs/common'

import InvalidCredentialsException from '@app/application/exception/InvalidCredentialsException'
import { User } from '@app/user/model/User.entity'
import NenaprasnoBackendClient from '@app/infrastructure/Nenaprasno/NenaprasnoBackendClient'

import SignInProvider from './SignInProvider'
import { UserRepository } from '@app/user/service/UserRepository'
import { UserCreator } from '@app/user/application/UserCreator'

@Injectable()
export default class NenaprasnoCabinetSignInProvider implements SignInProvider {
  public constructor(
    private readonly userRepo: UserRepository,
    private readonly nenaprasno: NenaprasnoBackendClient,
    private readonly userCreator: UserCreator,
  ) {}

  public async supports(login: string, password: string): Promise<boolean> {
    const id = await this.nenaprasno.signIn(login, password)

    return !!id
  }

  public async signIn(login: string, password: string): Promise<User> {
    const id = await this.nenaprasno.signIn(login, password)

    const valid = !!id

    if (!valid) {
      throw new InvalidCredentialsException({ login, password })
    }

    let user: User = await this.userRepo.findOneByCabinetId(id)

    if (!user) {
      user = await this.userCreator.createClient(id)
    }

    return user
  }
}
