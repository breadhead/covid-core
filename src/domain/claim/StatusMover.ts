import { Injectable } from '@nestjs/common'
import { InjectEntityManager } from '@nestjs/typeorm'
import { Option } from 'tsoption'
import { EntityManager } from 'typeorm'

import Configuration from '@app/infrastructure/Configuration/Configuration'
import Event from '@app/infrastructure/events/Event'
import EventEmitter from '@app/infrastructure/events/EventEmitter'
import { add } from '@app/infrastructure/utils/date'

import ActionUnavailableException from '../exception/ActionUnavailableException'
import Claim, { ClaimStatus } from './Claim.entity'
import ChangeStatusEvent from './event/ChangeStatusEvent'
import ClaimRejectedEvent from './event/ClaimRejectedEvent'
import DoctorAnswerEvent from './event/DoctorAnswerEvent'
import DueDateUpdatedEvent from './event/DueDateUpdatedEvent'
import ShortClaimApprovedEvent from './event/ShortClaimApprovedEvent'
import ShortClaimQueuedEvent from './event/ShortClaimQueuedEvent'

const DEFAULT_DURATION = '2d'

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

  private readonly maxDurations: { [key in ClaimStatus]?: Option<string> }

  public constructor(
    @InjectEntityManager() private readonly em: EntityManager,
    private readonly eventEmitter: EventEmitter,
    config: Configuration,
  ) {
    this.maxDurations = {
      [ClaimStatus.QuestionnaireWaiting]: config.get('DUARTION_QUESTIONNAIRE_WAITING'),
      [ClaimStatus.AtTheDoctor]: config.get('DURATION_AT_THE_DOCTOR'),
      [ClaimStatus.DeliveredToCustomer]: config.get('DURATION_DELIVERED_TO_CUSTOMER'),
    }
  }

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

    this.setDue(claim, newStatus)

    await this.em.save(claim)

    // Push events
    this.getEvents(claim)
      .forEach((event) => this.eventEmitter.emit(event))
  }

  private setDue(claim: Claim, newStatus: ClaimStatus): void {
    const statusDuration = this.maxDurations[newStatus]
    if (statusDuration) {
      const due = add(
        new Date(),
        statusDuration.getOrElse(DEFAULT_DURATION),
      )

      claim.changeDue(due)
    }
  }

  private getNextStatus(claim: Claim): Promise<ClaimStatus> {
    const getNextStatus: (cliam: Claim) => Promise<ClaimStatus> =
      this.getNextStatusMap[claim.status] || this.fromUnknown

    return getNextStatus(claim)
  }

  private getEvents(claim: Claim): Event[] {
    const actionEvent = {
      [ClaimStatus.Denied]: new ClaimRejectedEvent(claim),
      [ClaimStatus.DeliveredToCustomer]: new DoctorAnswerEvent(claim),
      [ClaimStatus.QuestionnaireWaiting]: new ShortClaimApprovedEvent(claim),
      [ClaimStatus.QueueForQuota]: new ShortClaimQueuedEvent(claim),
    }[claim.status]

    const statusEvent = new ChangeStatusEvent(claim)

    const dueDateEvents = Object
      .keys(this.maxDurations)
      .filter((key) => key === claim.status)
      .map(() => new DueDateUpdatedEvent(claim))

    const events = [actionEvent, statusEvent, ...dueDateEvents].filter(Boolean)

    return events
  }
}
