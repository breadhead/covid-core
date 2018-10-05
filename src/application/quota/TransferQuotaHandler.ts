import { ICommandHandler } from '@nestjs/cqrs'
import { InjectRepository } from '@nestjs/typeorm'

import Accountant from '@app/domain/quota/Accountant'
import QuotaRepository from '@app/domain/quota/QuotaRepository'
import CommandHandler from '@app/infrastructure/CommandBus/CommandHandler'

import TransferQuotaCommand from './TransferQuotaCommand'

@CommandHandler(TransferQuotaCommand)
export default class TransferQuotaHandler implements ICommandHandler<TransferQuotaCommand> {
  public constructor(
    @InjectRepository(QuotaRepository) private readonly quotaRepo: QuotaRepository,
    private readonly accountant: Accountant,
  ) { }

  public async execute(command: TransferQuotaCommand, resolve: (value?) => void) {
    const [ source, target ] = await Promise.all([
      this.quotaRepo.getOne(command.sourceId),
      this.quotaRepo.getOne(command.targetId),
    ])

    await this.accountant.tranfser(source, target, command.count)

    resolve([ source, target ])
  }
}
