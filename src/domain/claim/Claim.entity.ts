import { None, Option, Some } from 'tsoption'
import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm'

import InvariantViolationException from '../exception/InvariantViolationException'
import Quota from '../quota/Quota.entity'
import Analysis from './analysis/Analysis.vo'
import FileLink from './analysis/FileLink.vo'
import Applicant from './Applicant.vo'
import CorporateInfo, { CorporateParams } from './CorporateInfo.vo'
import { CorporateStatus } from './CorporateStatus'
import Question from './Question.vo'
import RelativesDisease from './RelativesDisease.vo'
import MedicinalTreatment from './treatment/MedicinalTreatment'
import RadiationTreatment from './treatment/RadiationTreatment'
import SurgicalTreatment from './treatment/SurgicalTreatment'
import { User } from '@app/user/model/User.entity'
import { Role } from '@app/user/model/Role'
import { Aids } from '@app/infrastructure/customTypes/Aids'
import { CommonLocalizationsEnum } from './CommonLocalizationsEnum'
import { DontUnderstandEnum } from './DontUnderstandEnum'

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
  ClosedWithoutAnswer = 'closed-without-answer',
  Feedback = 'feedback',
}

export const CLOSED_STATUSES = [
  ClaimStatus.ClosedSuccessfully,
  ClaimStatus.Denied,
  ClaimStatus.ClosedWithoutAnswer,
  ClaimStatus.Feedback,
]

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

  @Column()
  public readonly number: number

  @Column({ nullable: true })
  public readonly createdAt: Date

  public get applicant() {
    return this._applicant
  }

  @ManyToOne(type => User, { eager: true })
  @JoinColumn()
  public readonly author: User

  @Column()
  public overdueNotificated: boolean = false

  public get closeComment() {
    return this._closeComment
  }

  public get doctor() {
    return this._doctor
  }

  public get target() {
    return this._target
  }

  public get status(): ClaimStatus {
    return this._status
  }

  public get previousStatus(): ClaimStatus {
    return this._previousStatus
  }

  public get quota(): Quota | null {
    return this._quota
  }

  public get theme(): string {
    return this._theme
  }

  public get localization(): CommonLocalizationsEnum | string {
    return this._localization
  }

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
      defaultQuestions: (this._defaultQuestions || []).map(q => q.question),
      additionalQuestions: (this._additionalQuestions || []).map(
        q => q.question,
      ),
    }
  }

  public get questionsWithAnswers() {
    const questions = [...this._defaultQuestions, ...this._additionalQuestions]
    return questions.map(({ question, answer }) => {
      return { question, answer }
    })
  }

  public get answeredQuestions() {
    return {
      defaultQuestions: this._defaultQuestions,
      additionalQuestions: this._additionalQuestions,
    }
  }

  public get editedAt() {
    return this._editedAt
  }

  public get answeredAt() {
    return this._answeredAt
  }

  public get draftedAt() {
    return this._draftedAt
  }

  public get situationAddedAt() {
    return this._situationAddedAt
  }

  public get claimFinishedAt() {
    return this._claimFinishedAt
  }

  public get answerUpdatedAt() {
    return this._answerUpdatedAt
  }

  public get isFeedbackReminderSent() {
    return this._isFeedbackReminderSent
  }

  public get sentToDoctorAt() {
    return this._sentToDoctorAt
  }

  public get sentToClientAt() {
    return this._sentToClientAt
  }

  public get closedAt() {
    return this._closedAt
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

  @Column({ type: 'enum', enum: CorporateStatus })
  public corporateStatus: CorporateStatus

  @Column({ type: 'enum', enum: Role })
  public closedBy?: Role

  @ManyToOne(type => User, { eager: true, nullable: true })
  @JoinColumn()
  private _doctor?: User = null

  @JoinColumn()
  @ManyToOne(type => Quota, { eager: true, nullable: true })
  private _quota?: Quota

  @Column(type => Applicant)
  private _applicant: Applicant

  @Column()
  private _theme: string

  @Column({ nullable: true })
  private _localization?: string

  @Column({ type: 'enum', enum: ClaimTarget, default: ClaimTarget.Self })
  private _target: ClaimTarget = ClaimTarget.Self

  @Column({ type: 'enum', enum: ClaimStatus })
  private _status: ClaimStatus

  @Column({ type: 'enum', enum: ClaimStatus })
  private _previousStatus: ClaimStatus

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
  private _defaultQuestions: Question[] = []

  @Column({ type: 'json' })
  private _additionalQuestions: Question[] = []

  @Column({ nullable: true })
  private _closeComment?: string

  @Column({ nullable: true })
  private _editedAt: Date

  @Column({ nullable: true })
  private _answeredAt?: Date

  @Column({ nullable: true })
  private _draftedAt?: Date

  @Column({ nullable: true })
  private _situationAddedAt: Date

  @Column({ nullable: true })
  private _claimFinishedAt: Date

  @Column({ nullable: true })
  private _answerUpdatedAt?: Date

  @Column({ nullable: true })
  private _sentToDoctorAt?: Date

  @Column({ nullable: true })
  private _sentToClientAt?: Date

  @Column({ nullable: true })
  private _isFeedbackReminderSent?: boolean

  @Column({ nullable: true })
  private _closedAt?: Date

  @Column({ type: 'enum', enum: Aids })
  public aids?: Aids

  @Column({ type: 'json', nullable: true })
  public _doctors?: User[] = []

  @Column({ type: 'enum' })
  public _dontUnderstand: DontUnderstandEnum

  public constructor(
    id: string,
    number: number,
    createdAt: Date,
    editedAt: Date = createdAt,
    applicant: Applicant,
    author: User,
    theme: string,
    localization?: string,
    { company, position }: CorporateParams = {},
    target: ClaimTarget = ClaimTarget.Self,
    dontUnderstand: DontUnderstandEnum = DontUnderstandEnum.DEFAULT,
  ) {
    this.id = id
    this.number = number
    this.createdAt = createdAt
    this._editedAt = editedAt
    this._applicant = applicant
    this.author = author
    this._theme = theme
    this._localization = localization
    this._target = target
    this._doctors = []
    this._corporateInfo = new CorporateInfo({ company, position })

    this._status = ClaimStatus.New
    this._previousStatus = ClaimStatus.New
    this._analysis = new Analysis({})

    this.corporateStatus = this.defineInitialCorporateStatus()
    this._dontUnderstand = dontUnderstand
  }

  public isActive() {
    return !CLOSED_STATUSES.includes(this.status)
  }

  public isInactive() {
    return !this.isActive()
  }

  public bindQuota(quota: Quota): void {
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
    const now = new Date()

    if (newStatus === ClaimStatus.AtTheDoctor) {
      this._sentToDoctorAt = now
    }

    if (newStatus === ClaimStatus.DeliveredToCustomer) {
      this._sentToClientAt = now
    }

    if (CLOSED_STATUSES.includes(newStatus)) {
      this._closedAt = now
    }

    this._previousStatus = this._status
    this._status = newStatus
  }

  public changeDue(newDue: Date) {
    this._due = newDue
  }

  public removeDue() {
    this._due = null
  }

  public changeClosedBy(closedBy?: Role) {
    this.closedBy = closedBy
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
      }

      if (title === 'discharge') {
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

      return undefined
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
    this._defaultQuestions = (defaultQuestions || []).map(q => new Question(q))
    this._additionalQuestions = (additionalQuestions || []).map(
      q => new Question(q),
    )
  }

  public newApplicant(newApplicant: Applicant): void {
    this._applicant = newApplicant
  }

  public newCorporateInfo(newCorporateInfo: CorporateInfo): void {
    this._corporateInfo = newCorporateInfo

    const INITIAL_STATUSES = [CorporateStatus.Checking, CorporateStatus.Empty]
    if (!INITIAL_STATUSES.includes(this.corporateStatus)) {
      this.corporateStatus = this.defineInitialCorporateStatus()
    }
  }

  public changeShortDiseasesInfo(
    newTheme: string,
    newLocalization: string,
    newTarget: ClaimTarget,
  ): void {
    this._theme = newTheme
    this._localization = newLocalization
    this._target = newTarget
  }

  public answerQuestions(answers: Question[]) {
    const mapToAnswered = (unanswered: Question) =>
      answers.find(answered => answered.question === unanswered.question) ||
      unanswered

    this._defaultQuestions = this._defaultQuestions.map(mapToAnswered)
    this._additionalQuestions = this._additionalQuestions.map(mapToAnswered)
  }

  public attachDoctor(doctor: User): void {
    this._doctor = doctor

    if (!this._doctors) {
      this._doctors = []
    }

    this._doctors.push(doctor)
  }

  public changeCloseComment(comment: string) {
    this._closeComment = comment
  }

  public updateEditedAt() {
    this._editedAt = new Date()
  }

  public updateAnsweredAt() {
    this._answeredAt = new Date()
  }

  public updateDraftedAt() {
    this._draftedAt = new Date()
  }

  public updateSituationAddedAt() {
    this._situationAddedAt = new Date()
  }

  public updateClaimFinishedAt() {
    this._claimFinishedAt = new Date()
  }

  public updateAnswerUpdatedAt() {
    this._answerUpdatedAt = new Date()
  }

  public updateIsFeedbackReminderSent() {
    this._isFeedbackReminderSent = true
  }

  public updateSentToDoctorAt() {
    this._sentToDoctorAt = new Date()
  }

  public get dontUnderstand() {
    return this._dontUnderstand
  }

  public updateDontUnderstand(status: DontUnderstandEnum) {
    this._dontUnderstand = status
  }

  private defineInitialCorporateStatus() {
    return this.corporateInfo.isEmpty()
      ? CorporateStatus.Empty
      : CorporateStatus.Checking
  }
}
