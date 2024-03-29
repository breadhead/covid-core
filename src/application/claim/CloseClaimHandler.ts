import { CommandHandler } from '@breadhead/nest-throwable-bus'
import { ICommandHandler } from '@nestjs/cqrs'
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm'
import { head, intersection } from 'lodash'
import { EntityManager } from 'typeorm'

import { ClaimRepository } from '@app/domain/claim/ClaimRepository'
import StatusMover from '@app/domain/claim/StatusMover'
import Allocator from '@app/domain/quota/Allocator'

import CloseClaimCommand from './CloseClaimCommand'
import {
  rolesWithCloseLabel,
  RolesWithCloseLabelType,
  successCloseClaimTypes,
} from './config'

@CommandHandler(CloseClaimCommand)
export default class CloseClaimHandler
  implements ICommandHandler<CloseClaimCommand> {
  public constructor(
    @InjectEntityManager()
    private readonly em: EntityManager,
    private readonly claimRepo: ClaimRepository,
    private readonly allocator: Allocator,
    private readonly statusMover: StatusMover,
  ) {}

  public async execute(command: CloseClaimCommand, resolve: (value?) => void) {
    const { id, deallocateQuota, type, comment, closedBy } = command
    const claim = await this.claimRepo.getOne(id)
    claim.defineCloseType(type)

    if (deallocateQuota) {
      await this.allocator.deallocate(claim, true)
    }

    if (successCloseClaimTypes.includes(type)) {
      const author = head(intersection(rolesWithCloseLabel, closedBy))

      claim.changeCloseComment(comment)
      await this.statusMover.success(
        claim,
        type,
        author as RolesWithCloseLabelType,
      )
    } else {
      claim.changeCloseComment(comment)
      await this.em.save(claim)
      await this.statusMover.deny(claim)
    }

    resolve(claim)
  }
}
