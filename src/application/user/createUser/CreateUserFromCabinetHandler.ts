import { CommandHandler } from '@breadhead/nest-throwable-bus'
import { ICommandHandler } from '@nestjs/cqrs'
import { InjectEntityManager } from '@nestjs/typeorm'
import { EntityManager } from 'typeorm'

import Role from '@app/domain/user/Role'
import User from '@app/domain/user/User.entity'

import CreateUserFromCabinetCommand from './CreateUserFromCabinetCommand'

@CommandHandler(CreateUserFromCabinetCommand)
export default class CreateUserFromCabinetHandler
  implements ICommandHandler<CreateUserFromCabinetCommand> {
  public constructor(
    @InjectEntityManager() private readonly em: EntityManager,
  ) {}

  public async execute(
    command: CreateUserFromCabinetCommand,
    resolve: (value?) => void,
  ) {
    const { id } = command
    const login = `nenaprasno-cabinet-${id}`

    const user = new User(login)
    user.roles.push(Role.Client)
    user.bindToNenaprasnoCabinet(id)

    await this.em.save(user)

    resolve(user)
  }
}
