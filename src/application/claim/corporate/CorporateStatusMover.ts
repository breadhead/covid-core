import { Injectable } from '@nestjs/common'
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm'
import { EntityManager } from 'typeorm'

import { ClaimRepository } from '@app/domain/claim/ClaimRepository'
import { CorporateStatus } from '@app/domain/claim/CorporateStatus'
import ClaimEditedEvent from '@app/domain/claim/event/ClaimEditedEvent'
import EventEmitter from '@app/infrastructure/events/EventEmitter'

@Injectable()
export class CorporateStatusMover {
  public constructor(
    private readonly claimRepo: ClaimRepository,
    @InjectEntityManager() private readonly em: EntityManager,
    private readonly eventEmitter: EventEmitter,
  ) {}

  public async changeStatus(claimId: string, newStatus: CorporateStatus) {
    const claim = await this.claimRepo.getOne(claimId)

    claim.corporateStatus = newStatus

    await this.em.save(claim)

    await this.eventEmitter.emit(new ClaimEditedEvent(claim))
  }
}
