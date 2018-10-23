import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm'

import InvariantViolationException from '../exception/InvariantViolationException'
import Quota from '../quota/Quota.entity'
import User from '../user/User.entity'
import Applicant from './Applicant.vo'

export enum ClaimStatus {
  New = 'new',
  QuotaAllocation = 'quota-allocation',
  QueueForQuota = 'queue-for-quota',
  QuestionnaireWaiting = 'questionnaire-waiting',
  QuestionnaireValidation = 'questionnaire-validation',
  AtTheDoctor = 'at-the-doctor',
  AnswerValidation = 'answer-validation',
  DeliveredToCustomer = 'delivered-to-customer',
  ClosedSuccessfully = 'closed-successfully',
  Denied = 'denied',
}

@Entity()
export default class Claim {
  @PrimaryColumn()
  public readonly id: string

  @Column((type) => Applicant)
  public readonly applicant: Applicant

  @ManyToOne((type) => User)
  @JoinColumn()
  public readonly author: User

  public get status(): ClaimStatus { return this._status }

  public get quota(): Quota | null { return this._quota }

  @JoinColumn()
  @ManyToOne((type) => Quota, { eager: true, nullable: true })
  private _quota?: Quota

  @Column({ type: 'enum', enum: ClaimStatus })
  private _status: ClaimStatus

  public constructor(id: string, applicant: Applicant, author: User) {
    this.id = id
    this.applicant = applicant
    this.author = author

    this._status = ClaimStatus.New
  }

  public isActive() { // TODO: check claim is active
    return Math.random() > 0.2
  }

  public isInactive() {
    return !this.isActive()
  }

  public bindQuota(quota: Quota): void {
    if (this._quota) {
      throw new InvariantViolationException(Quota.name, 'Try to rebind quota')
    }

    this._quota = quota
  }

  public unbindQuota(): void {
    if (!this._quota) {
      throw new InvariantViolationException(Quota.name, 'Try to unbind empty quota')
    }

    this._quota = null
  }

  public changeStatus(newStatus: ClaimStatus) {
    this._status = newStatus
  }
}
