import { CommandHandler } from '@breadhead/nest-throwable-bus'
import { Inject } from '@nestjs/common'
import { ICommandHandler } from '@nestjs/cqrs'
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm'
import { EntityManager } from 'typeorm'

import UserRepository from '@app/domain/user/UserRepository'
import { IdGenerator } from '@app/utils/infrastructure/IdGenerator/IdGenerator'
import { PasswordEncoder } from '@app/utils/infrastructure/PasswordEncoder/PasswordEncoder'
import SmsSender, {
  SmsSender as SmsSenderSymbol,
} from '@app/infrastructure/SmsSender/SmsSender'

import SendVerificationCommand from './SendVerificationCommand'
import { Templating } from '@app/utils/infrastructure/Templating/Templating'

const CODE_LENGTH = 4

@CommandHandler(SendVerificationCommand)
export default class SendVerificationHandler
  implements ICommandHandler<SendVerificationCommand> {
  public constructor(
    @InjectEntityManager() private readonly em: EntityManager,
    private readonly idGenerator: IdGenerator,
    private readonly encoder: PasswordEncoder,
    @Inject(SmsSenderSymbol) private readonly smsSender: SmsSender,
    @InjectRepository(UserRepository) private readonly userRepo: UserRepository,
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
