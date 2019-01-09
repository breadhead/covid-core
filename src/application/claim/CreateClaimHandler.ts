import { CommandHandler } from '@breadhead/nest-throwable-bus'
import { Inject } from '@nestjs/common'
import { ICommandHandler } from '@nestjs/cqrs'
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm'
import { EntityManager } from 'typeorm'

import Applicant from '@app/domain/claim/Applicant.vo'
import Claim from '@app/domain/claim/Claim.entity'
import StatusMover from '@app/domain/claim/StatusMover'
import Allocator from '@app/domain/quota/Allocator'
import UserRepository from '@app/domain/user/UserRepository'
import IdGenerator, {
  IdGenerator as IdGeneratorSymbol,
} from '@app/infrastructure/IdGenerator/IdGenerator'

import CreateClaimCommand from './CreateClaimCommand'

@CommandHandler(CreateClaimCommand)
export default class CreateClaimHandler
  implements ICommandHandler<CreateClaimCommand> {
  public constructor(
    @InjectEntityManager() private readonly em: EntityManager,
    @Inject(IdGeneratorSymbol) private readonly idGenerator: IdGenerator,
    @InjectRepository(UserRepository) private readonly userRepo: UserRepository,
    private readonly allocator: Allocator,
    private readonly statusMover: StatusMover,
  ) {}

  public async execute(command: CreateClaimCommand, resolve: (value?) => void) {
    const claim = await this.createClaim(command)

    await this.allocator.allocateAuto(claim).catch(() => {
      /* ok, common quota not found */
    })

    await this.statusMover.next(claim) // Move to next status after qouta allocating

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
    const user = await this.userRepo.getOne(userLogin)

    return this.em.transaction(async em => {
      user.newContacts({ email, phone })

      const applicant = new Applicant(name, age, gender, region)

      const shortClaim = new Claim(
        id,
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

      const [savedClaim, ...rest] = await em.save([shortClaim, user])

      return savedClaim as Claim
    })
  }
}
