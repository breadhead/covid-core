import { Inject } from '@nestjs/common'
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { InjectEntityManager } from '@nestjs/typeorm'
import { EntityManager } from 'typeorm'

import Quota from '@app/domain/quota/Quota.entity'
import IdGenerator, { IdGenerator as IdGeneratorSymbol } from '@app/infrastructure/IdGenerator/IdGenerator'
import CreateQuotaCommand from './CreateQuotaCommand'

@CommandHandler(CreateQuotaCommand)
export default class CreateQuotaHandler implements ICommandHandler<CreateQuotaCommand> {
  public constructor(
    @InjectEntityManager() private readonly em: EntityManager,
    @Inject(IdGeneratorSymbol) private readonly idGenerator: IdGenerator,
  ) { }

  public async execute(command: CreateQuotaCommand, resolve: (value?) => void) {
    const id = this.idGenerator.get()

    const quota = new Quota(id, command.name, command.balance)

    await this.em.save(quota)

    resolve(quota)
  }
}
