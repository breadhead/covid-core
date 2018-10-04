import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm'
import { EntityManager } from 'typeorm'

import QuotaRepository from '@app/domain/quota/QuotaRepository'
import Transfer from '@app/domain/quota/Transfer.entity'
import ThrowableExecute from '@app/infrastructure/CommandBus/ThrowableExecute'

import TransferQuotaCommand from './TransferQuotaCommand'

@CommandHandler(TransferQuotaCommand)
export default class TransferQuotaHandler implements ICommandHandler<TransferQuotaCommand> {
  public constructor(
    @InjectEntityManager() private readonly em: EntityManager,
    @InjectRepository(QuotaRepository) private readonly quotaRepo: QuotaRepository,
  ) { }

  @ThrowableExecute()
  public async execute(command: TransferQuotaCommand, resolve: (value?) => void) {
    const [ source, target ] = await Promise.all([
      this.quotaRepo.getOne(command.sourceId),
      this.quotaRepo.getOne(command.targetId),
    ])

    await this.em.transaction((em) => {
      source.decreaseBalance(command.count)
      target.increaseBalance(command.count)

      const transfer = new Transfer(source, target, command.count, new Date())

      return Promise.all([
        em.save(source),
        em.save(target),
        em.save(transfer),
      ])
    })

    resolve([ source, target ])
  }
}
