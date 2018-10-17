import { CommandBus } from '@breadhead/nest-throwable-bus'
import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'

import InvalidCredentialsException from '@app/application/exception/InvalidCredentialsException'
import User from '@app/domain/user/User.entity'
import UserRepository from '@app/domain/user/UserRepository'
import NenaprasnoCabinetClient from '@app/infrastructure/Nenaprasno/NenaprasnoCabinetClient'
import TokenPayload from '@app/infrastructure/security/TokenPayload'

import CreateUserFromCabinetCommand from '../../createUser/CreateUserFromCabinetCommand'
import SignInProvider from './SignInProvider'

@Injectable()
export default class NenaprasnoCabinetSignInProvider implements SignInProvider {
  public constructor(
    @InjectRepository(UserRepository) private readonly userRepo: UserRepository,
    private readonly nenaprasno: NenaprasnoCabinetClient,
    private readonly bus: CommandBus,
  ) {}

  public async supports(login: string, password: string): Promise<boolean> {
    const id = await this.nenaprasno.signIn(login, password)

    return !!id
  }

  public async signIn(login: string, password: string): Promise<TokenPayload> {
    const id = await this.nenaprasno.signIn(login, password)

    const valid = !!id

    if (!valid) {
      throw new InvalidCredentialsException({ login, password })
    }

    let user: User = await this.userRepo.findOneByCabinetId(id)

    if (!user) {
      user = await this.bus.execute(new CreateUserFromCabinetCommand(id))
    }

    const payload: TokenPayload = { login: user.login }

    return payload
  }
}
