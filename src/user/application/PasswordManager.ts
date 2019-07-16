import { Injectable } from '@nestjs/common'
import { UserRepository } from '../service/UserRepository'
import { IdGenerator } from '@app/utils/service/IdGenerator/IdGenerator'
import { PasswordEncoder } from '@app/utils/service/PasswordEncoder/PasswordEncoder'
import { SmsSender } from '@app/sender/service/SmsSender/SmsSender'
import { EntitySaver } from '@app/db/EntitySaver'

@Injectable()
export class PasswordManager {
  public constructor(
    private readonly userRepo: UserRepository,
    private readonly idGenerator: IdGenerator,
    private readonly encoder: PasswordEncoder,
    private readonly smsSender: SmsSender,
    private readonly entitySaver: EntitySaver,
  ) {}
  async reset(email: string) {
    const user = await this.userRepo.getOneByContactEmail(email)
    if (!user.isClient || !user.contacts.phone) {
      return
    }

    const newPassword = this.idGenerator.getNumeric(6)

    await Promise.all([
      user.changePassword(newPassword, this.encoder),
      this.smsSender.send(user.contacts.phone, newPassword),
    ])

    await this.entitySaver.save(user)
  }
}
