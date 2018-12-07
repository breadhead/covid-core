import { CommandHandler } from '@breadhead/nest-throwable-bus'
import { ICommandHandler } from '@nestjs/cqrs'
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm'
import { EntityManager } from 'typeorm'

import DraftRepository from '@app/domain/draft/DraftRepository'

import EditDraftCommand from './EditDraftCommand'

@CommandHandler(EditDraftCommand)
export default class EditDraftHandler
  implements ICommandHandler<EditDraftCommand> {
  public constructor(
    @InjectEntityManager() private readonly em: EntityManager,
    @InjectRepository(DraftRepository)
    private readonly draftRepo: DraftRepository,
  ) {}

  public async execute(command: EditDraftCommand, resolve: (value?) => void) {
    const { id, body } = command

    const draft = await this.draftRepo.getOne(id)

    draft.changeBody(body)

    resolve(await this.em.save(draft))
  }
}
