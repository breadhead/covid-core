import { Injectable } from '@nestjs/common'
import { InjectEntityManager } from '@nestjs/typeorm'
import { EntityManager } from 'typeorm'

import { matches } from 'z'
import ActionUnavailableException from '../exception/ActionUnavailableException'
import Claim, { ClaimStatus } from './Claim.entity'

type GetStatus = (claim: Claim) => Promise<ClaimStatus>

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
    return this.em.transaction(async (em) => {
      claim.changeStatus(newStatus)

      // TODO: emit event by status

      await em.save(claim)
    })
  }

  private async getNextStatus(claim: Claim): Promise<ClaimStatus> {
    const getNextStatus: (cliam: Claim) => Promise<ClaimStatus> =
      this.getNextStatusMap[claim.status] || this.fromUnknown

    const nextStatus = await getNextStatus(claim)

    return nextStatus
  }
}
