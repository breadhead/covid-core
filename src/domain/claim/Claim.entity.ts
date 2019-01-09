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
import MedicinalTreatment from './treatment/MedicinalTreatment'
import RadiationTreatment from './treatment/RadiationTreatment'
import SurgicalTreatment from './treatment/SurgicalTreatment'

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

@Entity()
export default class Claim {
  @PrimaryColumn()
  public readonly id: string

  @Column({ nullable: true })
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
  public readonly localization?: string

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

  public get medicinalTreatments() {
    return this._medicinalTreatments
  }

  public get radiationTreatments() {
    return this._radiationTreatments
  }

  public get surgicalTreatments() {
    return this._surgicalTreatments
  }

  public get questions() {
    return {
      defaultQuestions: this._defaultQuestions,
      additionalQuestions: this._additionalQuestions,
    }
  }

  @Column({ nullable: true })
  public description?: string

  @Column({ nullable: true })
  public diagnosis?: string

  @Column({ nullable: true })
  public stage?: string

  @Column({ nullable: true })
  public otherDisease?: string

  @Column({ nullable: true })
  public feeling?: string

  @Column({ nullable: true })
  public worst?: string

  @Column({ nullable: true })
  public complaint?: string

  @Column({ nullable: true })
  public nowTreatment?: string

  @Column({ nullable: true })
  public diagnosisDate?: Date

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

  @Column({ type: 'json' })
  private _medicinalTreatments: MedicinalTreatment[] = []

  @Column({ type: 'json' })
  private _radiationTreatments: RadiationTreatment[] = []

  @Column({ type: 'json' })
  private _surgicalTreatments: SurgicalTreatment[] = []

  @Column({ type: 'json' })
  private _defaultQuestions: string[] = []

  @Column({ type: 'json' })
  private _additionalQuestions: string[] = []

  public constructor(
    id: string,
    createdAt: Date,
    applicant: Applicant,
    author: User,
    theme: string,
    localization?: string,
    { company, position }: CorporateParams = {},
    target: ClaimTarget = ClaimTarget.Self,
  ) {
    this.id = id
    this.createdAt = createdAt
    this.applicant = applicant
    this.author = author
    this.theme = theme
    this.localization = localization
    this.target = target

    this._corporateInfo = new CorporateInfo({ company, position })

    this._status = ClaimStatus.New
    this._analysis = new Analysis({})
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

  public addNewRelativesDiseases(diseases: RelativesDisease[]) {
    this._relativesDiseases = diseases
  }

  public newMedicinalTreatments(treatments: MedicinalTreatment[]): void {
    this._medicinalTreatments = treatments
  }

  public newRadiationTreatments(treatments: RadiationTreatment[]): void {
    this._radiationTreatments = treatments
  }

  public newSurgicalTreatments(treatments: SurgicalTreatment[]): void {
    this._surgicalTreatments = treatments
  }

  public newQuestions(
    defaultQuestions: string[],
    additionalQuestions: string[],
  ): void {
    this._defaultQuestions = defaultQuestions
    this._additionalQuestions = additionalQuestions
  }
}
