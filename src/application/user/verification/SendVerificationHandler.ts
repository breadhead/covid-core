import { CommandHandler } from '@breadhead/nest-throwable-bus'
import { Inject } from '@nestjs/common'
import { ICommandHandler } from '@nestjs/cqrs'
import { InjectEntityManager } from '@nestjs/typeorm'
import { EntityManager } from 'typeorm'

import IdGenerator, { IdGenerator as IdGeneratorSymbol } from '@app/infrastructure/IdGenerator/IdGenerator'
import PasswordEncoder,
{ PasswordEncoder as PasswordEncoderSymbol } from '@app/infrastructure/PasswordEncoder/PasswordEncoder'

import SendVerificationCommand from './SendVerificationCommand'

const CODE_LENGTH = 5

@CommandHandler(SendVerificationCommand)
export default class SendVerificationHandler implements ICommandHandler<SendVerificationCommand> {
  public constructor(
    @InjectEntityManager() private readonly em: EntityManager,
    @Inject(IdGeneratorSymbol) private readonly idGenerator: IdGenerator,
    @Inject(PasswordEncoderSymbol) private readonly encoder: PasswordEncoder,
  ) { }

  public async execute(command: SendVerificationCommand, resolve: (value?) => void) {
    const verificationCode = this.idGenerator.getNumeric(CODE_LENGTH)
    const encryptedCode = await this.encoder.encodePassword(verificationCode)
    // sms sending
    // sms writing in db with encrypt
    resolve()
  }
}
