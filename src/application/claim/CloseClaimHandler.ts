import { CommandHandler } from '@breadhead/nest-throwable-bus'
import { ICommandHandler } from '@nestjs/cqrs'
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm'
import { EntityManager } from 'typeorm'

import Applicant from '@app/domain/claim/Applicant.vo'
import Claim from '@app/domain/claim/Claim.entity'
import ClaimRepository from '@app/domain/claim/ClaimRepository'
import StatusMover from '@app/domain/claim/StatusMover'
import Allocator from '@app/domain/quota/Allocator'

import CloseClaimCommand from './CloseClaimCommand'

@CommandHandler(CloseClaimCommand)
export default class CloseClaimHandler implements ICommandHandler<CloseClaimCommand> {
  public constructor(
    @InjectRepository(ClaimRepository) private readonly claimRepo: ClaimRepository,
    private readonly allocator: Allocator,
    private readonly statusMover: StatusMover,
  ) { }

  public async execute(command: CloseClaimCommand, resolve: (value?) => void) {
    const { id, deallocateQuota } = command

    const claim = await this.claimRepo.getOne(id)

    if (deallocateQuota) {
      await this.allocator.deallocate(claim)
    }

    // TODO: handle close type

    await this.statusMover.deny(claim)

    resolve(claim)
  }
}
