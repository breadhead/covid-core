import { Injectable } from '@nestjs/common'

import { Role } from '@app/user/model/Role'
import { User } from '@app/user/model/User.entity'
import { EntitySaver } from '@app/db/EntitySaver'
import { PasswordEncoder } from '@app/utils/service/PasswordEncoder/PasswordEncoder'

@Injectable()
export class UserCreator {
  public constructor(
    private readonly entitySaver: EntitySaver,
    private readonly passwordEncoder: PasswordEncoder,
  ) {}

  async createClient(nenaprasnoId: number) {
    const login = `nenaprasno-cabinet-${nenaprasnoId}`

    const user = new User(login)
    user.roles.push(Role.Client)
    user.bindToNenaprasnoCabinet(nenaprasnoId)

    await this.entitySaver.save(user)

    return user
  }

  async createInternalClient(email: string, rawPassword: string) {
    const user = new User(email)

    await user.changePassword(rawPassword, this.passwordEncoder)

    user.roles.push(Role.Client)

    await this.entitySaver.save(user)

    return user
  }

  async createDoctor(
    email: string,
    rawPassword: string,
    name: string,
    boardUsername: string,
    desciption?: string,
  ) {
    const user = new User(email)

    await user.changePassword(rawPassword, this.passwordEncoder)

    user.roles.push(Role.Doctor)
    user.fullName = name
    user.boardUsername = boardUsername
    user.description = desciption

    await this.entitySaver.save(user)

    return user
  }
}
