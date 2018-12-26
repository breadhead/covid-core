import { CommandHandler } from '@breadhead/nest-throwable-bus'
import { ICommandHandler } from '@nestjs/cqrs'
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm'
import { EntityManager } from 'typeorm'

import Claim from '@app/domain/claim/Claim.entity'
import ClaimRepository from '@app/domain/claim/ClaimRepository'

import EditSituationCommand from './EditSituationCommand'

@CommandHandler(EditSituationCommand)
export default class EditSituationHandler
  implements ICommandHandler<EditSituationCommand> {
  public constructor(
    @InjectRepository(ClaimRepository)
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

    const editedClaim = await this.em.transaction(em => {
      this.updateAnlysis(command, claim)
      this.updateRelativesDiseases(command, claim)

      return em.save(claim)
    })

    resolve(editedClaim)
  }

  private updateAnlysis(
    { histology, discharge, otherFiles }: EditSituationCommand,
    claim: Claim,
  ): void {
    claim.addNewHisotlogy(histology.url)
    claim.addNewDischarge(discharge.url)
    claim.addNewAnalysis(otherFiles)
  }

  private updateRelativesDiseases(
    { relativesDiseases }: EditSituationCommand,
    claim: Claim,
  ): void {
    claim.addNewRelativesDiseases(relativesDiseases)
  }
}
