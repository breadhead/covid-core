import { CommandHandler } from '@breadhead/nest-throwable-bus'
import { Inject } from '@nestjs/common'
import { ICommandHandler } from '@nestjs/cqrs'
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm'
import { EntityManager } from 'typeorm'

import Applicant from '@app/domain/claim/Applicant.vo'
import Claim from '@app/domain/claim/Claim.entity'
import UserRepository from '@app/domain/user/UserRepository'
import IdGenerator, { IdGenerator as IdGeneratorSymbol } from '@app/infrastructure/IdGenerator/IdGenerator'

import NewClaimCommand from './NewClaimCommand'

@CommandHandler(NewClaimCommand)
export default class NewClaimHandler implements ICommandHandler<NewClaimCommand> {
  public constructor(
    @InjectEntityManager() private readonly em: EntityManager,
    @Inject(IdGeneratorSymbol) private readonly idGenerator: IdGenerator,
    @InjectRepository(UserRepository) private readonly userRepo: UserRepository,
  ) { }

  public async execute(command: NewClaimCommand, resolve: (value?) => void) {
    const {
      userLogin, email, phone,
      name, age, gender, region,
    } = command

    const id = this.idGenerator.get()
    const user = await this.userRepo.getOne(userLogin)

    const [ claim, ...rest ] = await this.em.transaction((em) => {
      user.newContacts({ email, phone })

      const applicant = new Applicant(name, age, gender, region)
      const shortClaim = new Claim(id, applicant, user)

      return em.save([
        shortClaim,
        user,
      ])
    })

    resolve(claim as Claim)
  }
}
