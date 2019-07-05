import { CommandHandler } from '@breadhead/nest-throwable-bus'
import { ICommandHandler } from '@nestjs/cqrs'
import { InjectEntityManager } from '@nestjs/typeorm'
import { EntityManager } from 'typeorm'

import { IdGenerator } from '@app/utils/service/IdGenerator/IdGenerator'
import { PasswordEncoder } from '@app/utils/service/PasswordEncoder/PasswordEncoder'

import SendVerificationCommand from './SendVerificationCommand'
import { Templating } from '@app/utils/service/Templating/Templating'
import { SmsSender } from '@app/sender/service/SmsSender/SmsSender'
import { UserRepository } from '@app/user/service/UserRepository'

const CODE_LENGTH = 4

@CommandHandler(SendVerificationCommand)
export default class SendVerificationHandler
  implements ICommandHandler<SendVerificationCommand> {
  public constructor(
    @InjectEntityManager() private readonly em: EntityManager,
    private readonly idGenerator: IdGenerator,
    private readonly encoder: PasswordEncoder,
    private readonly smsSender: SmsSender,
    private readonly userRepo: UserRepository,
    private readonly templating: Templating,
  ) {}

  public async execute(
    command: SendVerificationCommand,
    resolve: (value?) => void,
  ) {
    const verificationCode = this.idGenerator.getNumeric(CODE_LENGTH)

    const user = await this.userRepo.getOne(command.login)

    await this.em.transaction(async em => {
      await user.changeVerificationCode(verificationCode, this.encoder)

      await em.save(user)

      const text = await this.templating.render('sms/verification', {
        code: verificationCode,
      })

      await this.smsSender.send(command.number, text)
    })

    resolve()
  }
}
