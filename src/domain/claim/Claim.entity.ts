import { None, Option, Some } from 'tsoption'
import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm'

import InvariantViolationException from '../exception/InvariantViolationException'
import Quota from '../quota/Quota.entity'
import User from '../user/User.entity'
import Analysis from './analysis/Analysis.vo'
import FileLink from './analysis/FileLink.vo'
import Applicant from './Applicant.vo'
import CorporateInfo, { CorporateParams } from './CorporateInfo.vo'
import RelativesDisease from './RelativesDisease.vo'

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

export enum ClaimTarget {
  Self = 'Для себя',
  Other = 'Для близкого человека',
  Found = 'Для подопечного Фонда',
}

interface AnalysisData {
  title: string
  url: string
}

interface DiseaseData {
  relative: string
  localization: string
  diagnosisAge: number
}

@Entity()
export default class Claim {
  @PrimaryColumn()
  public readonly id: string

  @Column(type => Date)
  public readonly createdAt: Date

  @Column(type => Applicant)
  public readonly applicant: Applicant

  @ManyToOne(type => User, { eager: true })
  @JoinColumn()
  public readonly author: User

  @Column({ type: 'enum', enum: ClaimTarget, default: ClaimTarget.Self })
  public readonly target: ClaimTarget = ClaimTarget.Self

  public get status(): ClaimStatus {
    return this._status
  }

  public get quota(): Quota | null {
    return this._quota
  }

  @Column()
  public readonly theme: string

  @Column({ nullable: true })
  public readonly diagnosis?: string

  public get corporateInfo(): Option<CorporateInfo> {
    return this._corporateInfo.name && this._corporateInfo.position
      ? new Some(this._corporateInfo)
      : new None()
  }

  public get due(): Option<Date> {
    return this._due ? new Some(this._due) : new None()
  }

  public get analysis(): Analysis {
    return this._analysis
  }

  public get relativesDiseases(): RelativesDisease[] {
    return this._relativesDiseases
  }

  @JoinColumn()
  @ManyToOne(type => Quota, { eager: true, nullable: true })
  private _quota?: Quota

  @Column({ type: 'enum', enum: ClaimStatus })
  private _status: ClaimStatus

  @Column(type => CorporateInfo)
  private _corporateInfo: CorporateInfo

  @Column({ nullable: true })
  private _due?: Date

  @Column(type => Analysis)
  private _analysis: Analysis

  @Column({ type: 'json' })
  private _relativesDiseases: RelativesDisease[] = []

  public constructor(
    id: string,
    createdAt: Date,
    applicant: Applicant,
    author: User,
    theme: string,
    diagnosis?: string,
    { company, position }: CorporateParams = {},
    target: ClaimTarget = ClaimTarget.Self,
  ) {
    this.id = id
    this.createdAt = createdAt
    this.applicant = applicant
    this.author = author
    this.theme = theme
    this.diagnosis = diagnosis
    this.target = target

    this._corporateInfo = new CorporateInfo({ company, position })

    this._status = ClaimStatus.New
    this._analysis = new Analysis({})
    this._relativesDiseases = []
  }

  public isActive() {
    // TODO: check claim is active
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
      throw new InvariantViolationException(
        Claim.name,
        'Try to unbind empty quota',
      )
    }

    this._quota = null
  }

  public changeStatus(newStatus: ClaimStatus) {
    this._status = newStatus
  }

  public changeDue(newDue: Date) {
    this._due = newDue
  }

  public addNewHisotlogy(url: string) {
    const histology = new FileLink({
      title: 'histology',
      url,
    })

    this._analysis = new Analysis({
      ...this._analysis,
      histology,
    })
  }

  public addNewDischarge(url: string) {
    const discharge = new FileLink({
      title: 'discharge',
      url,
    })

    this._analysis = new Analysis({
      ...this._analysis,
      discharge,
    })
  }

  public addNewAnalysis(analysis: AnalysisData[]) {
    const titles = analysis.map(({ title }) => title)

    this._analysis = new Analysis({
      ...this._analysis,
      other: this.analysis.other.filter(file => titles.includes(file.title)),
    })

    analysis.forEach(({ title, url }) => {
      if (title === 'histology') {
        return this.addNewHisotlogy(url)
      } else if (title === 'discharge') {
        return this.addNewDischarge(url)
      }

      const other = [
        ...this._analysis.other.filter(file => file.title !== title),
        new FileLink({
          title,
          url,
        }),
      ]

      this._analysis = new Analysis({
        ...this._analysis,
        other,
      })
    })
  }

  public addNewRelativesDiseases(diseases: DiseaseData[]) {
    this._relativesDiseases = diseases.map(
      ({ relative, localization, diagnosisAge }) =>
        new RelativesDisease(relative, localization, diagnosisAge),
    )
  }
}
