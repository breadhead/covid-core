import { CommandHandler } from '@breadhead/nest-throwable-bus'
import { Inject } from '@nestjs/common'
import { ICommandHandler } from '@nestjs/cqrs'
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm'
import { EntityManager } from 'typeorm'

import UserRepository from '@app/domain/user/UserRepository'
import Configuration from '@app/infrastructure/Configuration/Configuration'
import IdGenerator, {
  IdGenerator as IdGeneratorSymbol,
} from '@app/infrastructure/IdGenerator/IdGenerator'
import PasswordEncoder, {
  PasswordEncoder as PasswordEncoderSymbol,
} from '@app/infrastructure/PasswordEncoder/PasswordEncoder'
import SmsSender, {
  SmsSender as SmsSenderSymbol,
} from '@app/infrastructure/SmsSender/SmsSender'
import TemplateEngine, {
  TemplateEngine as TemplateEngineSymbol,
} from '@app/infrastructure/TemplateEngine/TemplateEngine'

import SendVerificationCommand from './SendVerificationCommand'

const CODE_LENGTH = 4

@CommandHandler(SendVerificationCommand)
export default class SendVerificationHandler
  implements ICommandHandler<SendVerificationCommand> {
  private readonly smsContext: object

  public constructor(
    @InjectEntityManager() private readonly em: EntityManager,
    @Inject(IdGeneratorSymbol) private readonly idGenerator: IdGenerator,
    @Inject(PasswordEncoderSymbol) private readonly encoder: PasswordEncoder,
    @Inject(SmsSenderSymbol) private readonly smsSender: SmsSender,
    @InjectRepository(UserRepository) private readonly userRepo: UserRepository,
    @Inject(TemplateEngineSymbol) private readonly templating: TemplateEngine,
    config: Configuration,
  ) {
    this.smsContext = {
      link: config.get('SITE_URL').getOrElse('localhost'),
    }
  }

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
        ...this.smsContext,
        code: verificationCode,
      })

      await this.smsSender.send(command.number, text)
    })

    resolve()
  }
}
