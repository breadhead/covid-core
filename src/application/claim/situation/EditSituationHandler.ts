import { CommandHandler } from '@breadhead/nest-throwable-bus'
import { ICommandHandler } from '@nestjs/cqrs'
import { InjectEntityManager } from '@nestjs/typeorm'
import { EntityManager } from 'typeorm'

import Claim from '@app/domain/claim/Claim.entity'
import { ClaimRepository } from '@app/domain/claim/ClaimRepository'
import MedicinalTreatment from '@app/domain/claim/treatment/MedicinalTreatment'
import RadiationTreatment from '@app/domain/claim/treatment/RadiationTreatment'
import SurgicalTreatment from '@app/domain/claim/treatment/SurgicalTreatment'

import MonthYear from './dto/MonthYear'
import EditSituationCommand from './EditSituationCommand'

@CommandHandler(EditSituationCommand)
export default class EditSituationHandler
  implements ICommandHandler<EditSituationCommand> {
  public constructor(
    private readonly claimRepo: ClaimRepository,
    @InjectEntityManager()
    private readonly em: EntityManager,
  ) {}

  public async execute(
    command: EditSituationCommand,
    resolve: (value?) => void,
  ) {
    const { id } = command

    const claim = await this.claimRepo.getOne(id)

    claim.updateSituationAddedAt()

    const editedClaim = await this.em.transaction(em => {
      this.updateMainInfo(command, claim)
      this.updateAnlysis(command, claim)
      this.updateRelativesDiseases(command, claim)
      this.updateTreatments(command, claim)
      claim.updateEditedAt()

      return em.save(claim)
    })

    resolve(editedClaim)
  }

  private updateAnlysis(
    { histology, discharge, otherFiles }: EditSituationCommand,
    claim: Claim,
  ): void {
    if (histology) {
      claim.addNewHisotlogy(histology.url)
    }

    if (discharge) {
      claim.addNewDischarge(discharge.url)
    }

    claim.addNewAnalysis(otherFiles)
  }

  private updateRelativesDiseases(
    { relativesDiseases }: EditSituationCommand,
    claim: Claim,
  ): void {
    claim.addNewRelativesDiseases(relativesDiseases)
  }

  private updateMainInfo(
    {
      stage,
      worst,
      feeling,
      diagnosis,
      complaint,
      description,
      otherDisease,
      nowTreatment,
      diagnosisDate,
    }: EditSituationCommand,
    claim: Claim,
  ): void {
    claim.stage = stage
    claim.worst = worst
    claim.feeling = feeling
    claim.diagnosis = diagnosis
    claim.complaint = complaint
    claim.description = description
    claim.nowTreatment = nowTreatment
    claim.otherDisease = otherDisease
    claim.diagnosisDate = this.monthYearToDate(diagnosisDate)
  }

  private updateTreatments(
    {
      medicalsTreatments,
      radiationTreatments,
      surgicalTreatments,
    }: EditSituationCommand,
    claim: Claim,
  ): void {
    claim.newMedicinalTreatments(
      medicalsTreatments.map(
        treatments =>
          new MedicinalTreatment(
            treatments.region,
            this.monthYearToDate(treatments.when),
            treatments.clinic,
            treatments.doctor,
            this.monthYearToDate(treatments.end),
            treatments.cyclesCount,
            treatments.schema,
          ),
      ),
    )

    claim.newRadiationTreatments(
      radiationTreatments.map(
        treatments =>
          new RadiationTreatment(
            treatments.region,
            this.monthYearToDate(treatments.end),
            this.monthYearToDate(treatments.when),
            treatments.clinic,
            treatments.doctor,
            treatments.cyclesCount,
            treatments.schema,
          ),
      ),
    )

    claim.newSurgicalTreatments(
      surgicalTreatments.map(
        treatments =>
          new SurgicalTreatment(
            treatments.region,
            treatments.surgery,
            this.monthYearToDate(treatments.when),
            treatments.clinic,
            treatments.doctor,
          ),
      ),
    )
  }

  private monthYearToDate(monthYear?: MonthYear): Date | undefined {
    if (!monthYear) {
      return undefined
    }

    const { month, year } = monthYear

    return new Date(year, month - 1)
  }
}
