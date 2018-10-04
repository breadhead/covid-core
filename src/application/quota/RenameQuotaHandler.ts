import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm'
import { EntityManager } from 'typeorm'

import QuotaRepository from '@app/domain/quota/QuotaRepository'

import RenameQuotaCommand from './RenameQuotaCommand'

@CommandHandler(RenameQuotaCommand)
export default class RenameQuotaHandler implements ICommandHandler<RenameQuotaCommand> {
  public constructor(
    @InjectEntityManager() private readonly em: EntityManager,
    @InjectRepository(QuotaRepository) private readonly quotaRepo: QuotaRepository,
  ) { }

  public async execute(command: RenameQuotaCommand, resolve: (value?) => void) {
    const quota = await this.quotaRepo.getOne(command.id)

    await this.em.transaction((em) => {
      quota.rename(command.newName)

      return em.save(quota)
    })

    resolve(quota)
  }
}
