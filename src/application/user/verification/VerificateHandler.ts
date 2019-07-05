import { CommandHandler } from '@breadhead/nest-throwable-bus'
import { ICommandHandler } from '@nestjs/cqrs'
import { InjectEntityManager } from '@nestjs/typeorm'
import { EntityManager } from 'typeorm'

import VerificationFailedException from '@app/application/exception/VerificationFailedException'
import { PasswordEncoder } from '@app/utils/service/PasswordEncoder/PasswordEncoder'
import { UserRepository } from '@app/user/service/UserRepository'

import VerificateCommand from './VerificateCommand'

@CommandHandler(VerificateCommand)
export default class VerificateHandler
  implements ICommandHandler<VerificateCommand> {
  public constructor(
    @InjectEntityManager() private readonly em: EntityManager,
    private readonly encoder: PasswordEncoder,
    private readonly userRepo: UserRepository,
  ) {}

  public async execute(command: VerificateCommand, resolve: (value?) => void) {
    const { code, login } = command

    await this.em.transaction(async em => {
      const user = await this.userRepo.getOne(login)

      const valid = await this.encoder.isPasswordValid(
        user.verificationCode,
        code,
      )

      if (!valid) {
        throw new VerificationFailedException(code)
      }

      user.becomeValide()

      await em.save(user)
    })

    resolve()
  }
}
