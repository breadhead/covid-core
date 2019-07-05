import { CommandHandler } from '@breadhead/nest-throwable-bus'
import { ICommandHandler } from '@nestjs/cqrs'
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm'
import { EntityManager } from 'typeorm'

import Draft from '@app/domain/draft/Draft.entity'
import UserRepository from '@app/domain/user/UserRepository'
import { IdGenerator } from '@app/utils/service/IdGenerator/IdGenerator'

import CreateDraftCommand from './CreateDraftCommand'

@CommandHandler(CreateDraftCommand)
export default class CreateDraftHandler
  implements ICommandHandler<CreateDraftCommand> {
  public constructor(
    @InjectEntityManager() private readonly em: EntityManager,
    @InjectRepository(UserRepository) private readonly userRepo: UserRepository,
    private readonly idGenerator: IdGenerator,
  ) {}

  public async execute(command: CreateDraftCommand, resolve: (value?) => void) {
    const { userLogin, body } = command

    const user = await this.userRepo.getOne(userLogin)

    const id = this.idGenerator.get()

    const draft = await this.em.save(new Draft(id, new Date(), body, user))

    resolve(draft)
  }
}
