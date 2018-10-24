import { None, Option, Some } from 'tsoption'
import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm'

import InvariantViolationException from '../exception/InvariantViolationException'
import Quota from '../quota/Quota.entity'
import User from '../user/User.entity'
import Applicant from './Applicant.vo'
import CorporateInfo, { CorporateParams } from './CorporateInfo.vo'

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

  @ManyToOne((type) => User, { eager: true })
  @JoinColumn()
  public readonly author: User

  public get status(): ClaimStatus { return this._status }

  public get quota(): Quota | null { return this._quota }

  @Column()
  public readonly theme: string

  @Column({ nullable: true })
  public readonly diagnosis?: string

  public get corporateInfo(): Option<CorporateInfo> {
    return this._corporateInfo.name && this._corporateInfo.position
      ? new Some(this._corporateInfo)
      : new None()
  }

  @JoinColumn()
  @ManyToOne((type) => Quota, { eager: true, nullable: true })
  private _quota?: Quota

  @Column({ type: 'enum', enum: ClaimStatus })
  private _status: ClaimStatus

  @Column((type) => CorporateInfo)
  private _corporateInfo: CorporateInfo

  public constructor(
    id: string, applicant: Applicant, author: User,
    theme: string, diagnosis?: string,
    { company, position }: CorporateParams = {},
  ) {
    this.id = id
    this.applicant = applicant
    this.author = author
    this.theme = theme
    this.diagnosis = diagnosis

    this._corporateInfo = new CorporateInfo({ company, position })

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
      throw new InvariantViolationException(Claim.name, 'Try to rebind quota')
    }

    this._quota = quota
  }

  public unbindQuota(): void {
    if (!this._quota) {
      throw new InvariantViolationException(Claim.name, 'Try to unbind empty quota')
    }

    this._quota = null
  }

  public changeStatus(newStatus: ClaimStatus) {
    this._status = newStatus
  }
}
