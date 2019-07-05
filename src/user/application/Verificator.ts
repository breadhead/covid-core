import { Injectable } from '@nestjs/common'

import { IdGenerator } from '@app/utils/service/IdGenerator/IdGenerator'
import { EntitySaver } from '@app/db/EntitySaver'
import { PasswordEncoder } from '@app/utils/service/PasswordEncoder/PasswordEncoder'
import { SmsSender } from '@app/sender/service/SmsSender/SmsSender'
import { Templating } from '@app/utils/service/Templating/Templating'

import { UserRepository } from '../service/UserRepository'
import { VerificationFailedException } from './exception/VerificationFailedException'

@Injectable()
export class Verificator {
  constructor(
    private readonly idGenerator: IdGenerator,
    private readonly userRepo: UserRepository,
    private readonly entitySaver: EntitySaver,
    private readonly passwordEncoder: PasswordEncoder,
    private readonly smsSender: SmsSender,
    private readonly templating: Templating,
  ) {}

  async sendCode(userLogin: string, phoneNumeber: string) {
    const user = await this.userRepo.getOne(userLogin)

    const CODE_LENGTH = 4
    const verificationCode = this.idGenerator.getNumeric(CODE_LENGTH)

    await user.changeVerificationCode(verificationCode, this.passwordEncoder)

    const text = await this.templating.render('sms/verification', {
      code: verificationCode,
    })
    await this.smsSender.send(phoneNumeber, text)

    await this.entitySaver.save(user)
  }

  async validateCode(userLogin: string, verificationCode: string) {
    const user = await this.userRepo.getOne(userLogin)

    const valid = await this.passwordEncoder.isPasswordValid(
      user.verificationCode,
      verificationCode,
    )

    if (!valid) {
      throw new VerificationFailedException(verificationCode)
    }

    user.becomeValide()

    await this.entitySaver.save(user)
  }
}
