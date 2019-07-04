import { Injectable } from '@nestjs/common'
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm'
import { EntityManager } from 'typeorm'

import UserRepository from '@app/domain/user/UserRepository'
import { PasswordEncoder } from '@app/utils/infrastructure/PasswordEncoder/PasswordEncoder'
import User from '@app/domain/user/User.entity'
import Role from '@app/domain/user/Role'

@Injectable()
export class DoctorManager {
  public constructor(
    @InjectEntityManager() private readonly em: EntityManager,
    private readonly passwordEncoder: PasswordEncoder,
    @InjectRepository(UserRepository) private readonly userRepo: UserRepository,
  ) {}

  async createOrEdit(
    email: string,
    rawPassword: string,
    name: string,
    boardUsername: string,
    desciption?: string,
  ) {
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

    return !userExists
  }
}
