import { CommandHandler } from '@breadhead/nest-throwable-bus'
import { Inject } from '@nestjs/common'
import { ICommandHandler } from '@nestjs/cqrs'
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm'
import { random } from 'lodash'
import { EntityManager } from 'typeorm'

import Applicant from '@app/domain/claim/Applicant.vo'
import Claim from '@app/domain/claim/Claim.entity'
import StatusMover from '@app/domain/claim/StatusMover'
import UserRepository from '@app/domain/user/UserRepository'
import { IdGenerator } from '@app/utils/infrastructure/IdGenerator/IdGenerator'

import { ClaimRepository } from '@app/domain/claim/ClaimRepository'
import ClaimEditedEvent from '@app/domain/claim/event/ClaimEditedEvent'
import EventEmitter from '@app/infrastructure/events/EventEmitter'
import CreateClaimCommand from './CreateClaimCommand'

@CommandHandler(CreateClaimCommand)
export default class CreateClaimHandler
  implements ICommandHandler<CreateClaimCommand> {
  public constructor(
    @InjectEntityManager() private readonly em: EntityManager,
    private readonly idGenerator: IdGenerator,
    @InjectRepository(UserRepository) private readonly userRepo: UserRepository,
    private readonly claimRepository: ClaimRepository,
    private readonly statusMover: StatusMover,
    private readonly eventEmitter: EventEmitter,
  ) {}

  public async execute(command: CreateClaimCommand, resolve: (value?) => void) {
    const claim = await this.createClaim(command)

    resolve(claim as Claim)
  }

  private async createClaim(command: CreateClaimCommand): Promise<Claim> {
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

    const id = this.idGenerator.get()

    const [user, number] = await Promise.all([
      this.userRepo.getOne(userLogin),
      this.generateNextNumber(),
    ])

    return this.em.transaction(async em => {
      user.newContacts({ email, phone })

      const applicant = new Applicant(name, age, gender, region)

      const shortClaim = new Claim(
        id,
        number,
        new Date(),
        new Date(),
        applicant,
        user,
        theme,
        localization,
        {
          company,
          position,
        },
        target,
      )

      await this.statusMover.afterCreate(shortClaim)

      const [savedClaim, ...rest] = await em.save([shortClaim, user])

      await this.eventEmitter.emit(new ClaimEditedEvent(savedClaim as Claim))

      return savedClaim as Claim
    })
  }

  private async generateNextNumber(): Promise<number> {
    return (await this.claimRepository.count()) * 10 + random(0, 9)
  }
}
