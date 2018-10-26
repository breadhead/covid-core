import { CommandHandler } from '@breadhead/nest-throwable-bus'
import { Inject } from '@nestjs/common'
import { ICommandHandler } from '@nestjs/cqrs'
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm'
import { EntityManager } from 'typeorm'

import VerificationFailedException from '@app/application/exception/VerificationFailedException'
import UserRepository from '@app/domain/user/UserRepository'
import IdGenerator, { IdGenerator as IdGeneratorSymbol } from '@app/infrastructure/IdGenerator/IdGenerator'
import PasswordEncoder,
{ PasswordEncoder as PasswordEncoderSymbol } from '@app/infrastructure/PasswordEncoder/PasswordEncoder'
import SmsSender, { SmsSender as SmsSenderSymbol } from '@app/infrastructure/SmsSender/SmsSender'

import VerificateCommand from './VerificateCommand'

@CommandHandler(VerificateCommand)
export default class VerificateHandler implements ICommandHandler<VerificateCommand> {
  public constructor(
    @InjectEntityManager() private readonly em: EntityManager,
    @Inject(PasswordEncoderSymbol) private readonly encoder: PasswordEncoder,
    @InjectRepository(UserRepository) private readonly userRepo: UserRepository,
  ) { }

  public async execute(command: VerificateCommand, resolve: (value?) => void) {
    const { code, login } = command

    await this.em.transaction(async (em) => {
      const user = await this.userRepo.getOne(login)

      const valid = await this.encoder.isPasswordValid(user.verificationCode, code)

      if (!valid) {
        throw new VerificationFailedException(code)
      }

      user.becomeValide()

      await em.save(user)
    })

    resolve()
  }
}
