import { Injectable } from '@nestjs/common'
import { InjectEntityManager } from '@nestjs/typeorm'
import { EntityManager } from 'typeorm'

import { PasswordEncoder } from '@app/utils/service/PasswordEncoder/PasswordEncoder'
import { User } from '@app/user/model/User.entity'
import { Role } from '@app/user/model/Role'
import { UserRepository } from '@app/user/service/UserRepository'

@Injectable()
export class DoctorManager {
  public constructor(
    @InjectEntityManager() private readonly em: EntityManager,
    private readonly passwordEncoder: PasswordEncoder,
    private readonly userRepo: UserRepository,
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
