import { CommandHandler } from '@breadhead/nest-throwable-bus'
import { ICommandHandler } from '@nestjs/cqrs'
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm'
import { EntityManager } from 'typeorm'

import Applicant from '@app/domain/claim/Applicant.vo'
import Claim from '@app/domain/claim/Claim.entity'
import ClaimRepository from '@app/domain/claim/ClaimRepository'
import CorporateInfo from '@app/domain/claim/CorporateInfo.vo'
import UserRepository from '@app/domain/user/UserRepository'
import EventEmitter from '@app/infrastructure/events/EventEmitter'

import ClaimEditedEvent from '@app/domain/claim/event/ClaimEditedEvent'
import EditShortClaimCommand from './EditShortClaimCommand'

@CommandHandler(EditShortClaimCommand)
export default class EditShortClaimHandler
  implements ICommandHandler<EditShortClaimCommand> {
  public constructor(
    @InjectEntityManager() private readonly em: EntityManager,
    @InjectRepository(UserRepository) private readonly userRepo: UserRepository,
    @InjectRepository(ClaimRepository)
    private readonly claimRepo: ClaimRepository,
    private readonly eventEmitter: EventEmitter,
  ) {}

  public async execute(
    command: EditShortClaimCommand,
    resolve: (value?) => void,
  ) {
    const { id } = command
    const claim = await this.claimRepo.getOne(id)

    const editedClaim = await this.editClaim(claim, command)

    resolve(editedClaim)
  }

  private async editClaim(
    claim: Claim,
    command: EditShortClaimCommand,
  ): Promise<Claim> {
    const {
      userLogin,
      email,
      phone,
      name,
      age,
      gender,
      region,
      theme,
      localization,
      company,
      position,
      target,
    } = command

    const user = await this.userRepo.getOne(userLogin)

    return this.em.transaction(async em => {
      user.newContacts({ email, phone })

      const applicant = new Applicant(name, age, gender, region)
      const corporate = new CorporateInfo({ company, position })

      claim.newApplicant(applicant)
      claim.newCorporateInfo(corporate)
      claim.changeShortDiseasesInfo(theme, localization, target)

      const [savedClaim, ...rest] = await em.save([claim, user])

      this.eventEmitter.emit(new ClaimEditedEvent(savedClaim as Claim))

      return savedClaim as Claim
    })
  }
}
