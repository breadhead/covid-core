import { Injectable } from '@nestjs/common'

import { PasswordEncoder } from '@app/utils/service/PasswordEncoder/PasswordEncoder'
import { User } from '@app/user/model/User.entity'
import { Role } from '@app/user/model/Role'
import { UserRepository } from '@app/user/service/UserRepository'
import { EntitySaver } from '@app/db/EntitySaver'

@Injectable()
export class DoctorManager {
  public constructor(
    private readonly entitySaver: EntitySaver,
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

    const user = new User(email)

    await user.changePassword(rawPassword, this.passwordEncoder)

    user.roles.push(Role.Doctor)
    user.fullName = name
    user.boardUsername = boardUsername
    user.description = desciption

    await this.entitySaver.save(user)

    return !userExists
  }
}
