import { CommandHandler } from '@breadhead/nest-throwable-bus'
import { Inject } from '@nestjs/common'
import { ICommandHandler } from '@nestjs/cqrs'
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm'
import { EntityManager } from 'typeorm'

import Role from '@app/domain/user/Role'
import User from '@app/domain/user/User.entity'
import UserRepository from '@app/domain/user/UserRepository'
import PasswordEncoder, {
  PasswordEncoder as PasswordEncoderSymbol,
} from '@app/infrastructure/PasswordEncoder/PasswordEncoder'

import CreateDoctorCommand from './CreateDoctorCommand'

@CommandHandler(CreateDoctorCommand)
export default class CreateDoctorHandler
  implements ICommandHandler<CreateDoctorCommand> {
  public constructor(
    @InjectEntityManager() private readonly em: EntityManager,
    @Inject(PasswordEncoderSymbol)
    private readonly passwordEncoder: PasswordEncoder,
    @InjectRepository(UserRepository) private readonly userRepo: UserRepository,
  ) {}

  public async execute(
    command: CreateDoctorCommand,
    resolve: (value?) => void,
  ) {
    const { email, rawPassword, name, boardUsername, desciption } = command

    const userExists = !!(await this.userRepo.findOne(email))

    await this.em.transaction(async em => {
      const user = new User(email)

      await user.changePassword(rawPassword, this.passwordEncoder)

      user.roles.push(Role.Doctor)
      user.fullName = name
      user.boardUsername = boardUsername
      user.description = desciption

      return em.save(user)
    })

    resolve(!userExists)
  }
}
