import { EntitySaver } from '@app/db/EntitySaver'
import CreateDoctorRequest from '@app/presentation/http/request/CreateDoctorRequest'
import { Role } from '@app/user/model/Role'
import { User } from '@app/user/model/User.entity'
import { PasswordEncoder } from '@app/utils/service/PasswordEncoder/PasswordEncoder'
import { Injectable } from '@nestjs/common'
import { getRandomColor } from './helpers/passwordSource'
import { IdGenerator } from '@app/utils/service/IdGenerator/IdGenerator'

@Injectable()
export class UserCreator {
  public constructor(
    private readonly entitySaver: EntitySaver,
    private readonly passwordEncoder: PasswordEncoder,
    private readonly idGenerator: IdGenerator,
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

  async createDoctor(data: CreateDoctorRequest) {
    const {
      name,
      email,
      boardUsername,
      rawPassword,
      description,
      telegramId,
    } = data

    const user = new User(email)

    await user.changePassword(rawPassword, this.passwordEncoder)

    user.roles.push(Role.Doctor)
    user.fullName = name
    user.boardUsername = boardUsername
    user.description = description
    user.newContacts(email, null, telegramId)

    await this.entitySaver.save(user)

    return user
  }

  async generatePassword() {
    return `${getRandomColor()}_${getRandomColor()}_${this.idGenerator.getNumeric(
      2,
    )}`
  }
}
