import { EntitySaver } from '@app/db/EntitySaver'
import CreateDoctorRequest from '@app/presentation/http/request/CreateDoctorRequest'
import { Role } from '@app/user/model/Role'
import { User } from '@app/user/model/User.entity'
import { PasswordEncoder } from '@app/utils/service/PasswordEncoder/PasswordEncoder'
import { Injectable } from '@nestjs/common'
import { getRandomColor } from './helpers/passwordSource'
import { IdGenerator } from '@app/utils/service/IdGenerator/IdGenerator'
import { UserRepository } from '@app/user/service/UserRepository'

@Injectable()
export class UserCreator {
  public constructor(
    private readonly entitySaver: EntitySaver,
    private readonly passwordEncoder: PasswordEncoder,
    private readonly idGenerator: IdGenerator,
    private readonly userRepo: UserRepository,
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
    const raw = this.generateRawPassword()
    const doctors = await this.userRepo.findDoctors()

    const passwords = doctors
      .map(doc => doc.passwordCredentials.getOrElse(null))
      .filter(it => !!it)
      .map(it => it.password)

    const overlaps = await Promise.all(
      passwords.map(pas => this.passwordEncoder.isPasswordValid(pas, raw)),
    )

    const filteredOverlaps = overlaps.filter(ov => !!ov)

    if (filteredOverlaps.length > 0) {
      this.generatePassword()
    }

    return raw
  }

  private generateRawPassword() {
    return `${getRandomColor()}_${getRandomColor()}_${this.idGenerator.getNumeric(
      2,
    )}`
  }
}
