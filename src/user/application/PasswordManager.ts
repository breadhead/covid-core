import { Injectable } from '@nestjs/common'
import { UserRepository } from '../service/UserRepository'
import { IdGenerator } from '@app/utils/service/IdGenerator/IdGenerator'
import { PasswordEncoder } from '@app/utils/service/PasswordEncoder/PasswordEncoder'

@Injectable()
export class PasswordManager {
  public constructor(
    private readonly userRepo: UserRepository,
    private readonly idGenerator: IdGenerator,
    private readonly encoder: PasswordEncoder,
  ) {}
  async reset(login: string) {
    const user = await this.userRepo.getOne(login)
    if (!user.isClient) {
      return
    }

    if (!user.contacts.email || !user.contacts.phone) {
      return
    }

    const newPassword = this.idGenerator.getNumeric(6)
    user.changePassword(newPassword, this.encoder)
    // change user login to email
    // send new password by SMS
  }
}
