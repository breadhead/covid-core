import { Injectable } from '@nestjs/common'
import { InjectEntityManager } from '@nestjs/typeorm'
import { EntityManager } from 'typeorm'

import Event from '@app/infrastructure/events/Event'
import EventEmitter from '@app/infrastructure/events/EventEmitter'

import ActionUnavailableException from '../exception/ActionUnavailableException'
import Claim, { ClaimStatus } from './Claim.entity'
import ClaimRejectedEvent from './event/ClaimRejectedEvent'
import DoctorAnswerEvent from './event/DoctorAnswerEvent'
import ShortClaimApprovedEvent from './event/ShortClaimApprovedEvent'
import ShortClaimQueuedEvent from './event/ShortClaimQueuedEvent'

@Injectable()
export default class StatusMover {
  private readonly getNextStatusMap = {
    [ClaimStatus.New]: this.fromNew,
    [ClaimStatus.QuotaAllocation]: this.fromQuotaAllocation,
    [ClaimStatus.QuestionnaireWaiting]: this.fromQuestionnaireWaiting,
    [ClaimStatus.QuestionnaireValidation]: this.fromQuestionnaireValidation,
    [ClaimStatus.AtTheDoctor]: this.fromAtTheDoctor,
    [ClaimStatus.AnswerValidation]: this.fromAnswerValidation,
    [ClaimStatus.DeliveredToCustomer]: this.fromDeliveredToCustomer,
  }

  public constructor(
    @InjectEntityManager() private readonly em: EntityManager,
    private readonly eventEmitter: EventEmitter,
  ) { }

  public async deny(claim: Claim): Promise<void> {
    const newStatus = ClaimStatus.Denied

    await this.changeStatus(claim, newStatus)
  }

  public async next(claim: Claim): Promise<void> {
    const newStatus = await this.getNextStatus(claim)

    await this.changeStatus(claim, newStatus)
  }

  private async fromNew(claim: Claim): Promise<ClaimStatus> {
    const quotaAllocated = Boolean(claim.quota)

    return quotaAllocated
      ? ClaimStatus.QuestionnaireWaiting
      : ClaimStatus.QuotaAllocation
  }

  private async fromQuotaAllocation(claim: Claim): Promise<ClaimStatus> {
    const quotaAllocated = Boolean(claim.quota)

    return quotaAllocated
      ? ClaimStatus.QuestionnaireWaiting
      : ClaimStatus.QueueForQuota
  }

  private async fromQuestionnaireWaiting(cliam: Claim): Promise<ClaimStatus> {
    return ClaimStatus.QuestionnaireValidation
  }

  private async fromQuestionnaireValidation(cliam: Claim): Promise<ClaimStatus> {
    return ClaimStatus.AtTheDoctor
  }

  private async fromAtTheDoctor(cliam: Claim): Promise<ClaimStatus> {
    return ClaimStatus.AnswerValidation
  }

  private async fromAnswerValidation(claim: Claim): Promise<ClaimStatus> {
    return ClaimStatus.DeliveredToCustomer
  }

  private async fromDeliveredToCustomer(cliam: Claim): Promise<ClaimStatus> {
    return ClaimStatus.ClosedSuccessfully
  }

  private async fromUnknown(claim: Claim) {
    throw new ActionUnavailableException(Claim.name, `Unknown status in claim #${claim.id}`)
  }

  private async changeStatus(claim: Claim, newStatus: ClaimStatus): Promise<void> {
    claim.changeStatus(newStatus)

    await this.em.save(claim)

    // Push events
    const event = this.getEvent(claim)
    if (event) {
      this.eventEmitter.emit(event)
    }
  }

  private getNextStatus(claim: Claim): Promise<ClaimStatus> {
    const getNextStatus: (cliam: Claim) => Promise<ClaimStatus> =
      this.getNextStatusMap[claim.status] || this.fromUnknown

    return getNextStatus(claim)
  }

  private getEvent(claim: Claim): Event | null {
    switch (claim.status) {
    case ClaimStatus.Denied:
      return new ClaimRejectedEvent(claim)
    case ClaimStatus.DeliveredToCustomer:
      return new DoctorAnswerEvent(claim)
    case ClaimStatus.QuestionnaireWaiting:
      return new ShortClaimApprovedEvent(claim)
    case ClaimStatus.QueueForQuota:
      return new ShortClaimQueuedEvent(claim)
    default:
      return null
    }
  }
}
