import { CommandHandler } from '@breadhead/nest-throwable-bus'
import { ICommandHandler } from '@nestjs/cqrs'
import { InjectRepository } from '@nestjs/typeorm'

import ClaimRepository from '@app/domain/claim/ClaimRepository'
import StatusMover from '@app/domain/claim/StatusMover'
import Allocator from '@app/domain/quota/Allocator'
import QuotaRepository from '@app/domain/quota/QuotaRepository'

import BindQuotaCommand from './BindQuotaCommand'

@CommandHandler(BindQuotaCommand)
export default class BindQuotaHandler
  implements ICommandHandler<BindQuotaCommand> {
  public constructor(
    @InjectRepository(QuotaRepository)
    private readonly quotaRepo: QuotaRepository,
    @InjectRepository(ClaimRepository)
    private readonly claimRepo: ClaimRepository,
    private readonly allocator: Allocator,
    private readonly statusMover: StatusMover,
  ) {}

  public async execute(command: BindQuotaCommand, resolve: (value?) => void) {
    const { quotaId, claimId } = command

    const [claim, quota] = await Promise.all([
      this.claimRepo.getOne(claimId),
      this.quotaRepo.getOne(quotaId),
    ])

    await this.allocator.allocate(claim, quota)
    await this.statusMover.afterAllocation(claim)

    resolve()
  }
}
