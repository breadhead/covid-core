import { ICommandHandler } from '@nestjs/cqrs'
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm'
import { EntityManager } from 'typeorm'

import ClaimRepository from '@app/domain/claim/ClaimRepository'
import Message from '@app/domain/claim/Message.entity'
import ActionUnavailableException from '@app/domain/exception/ActionUnavailableException'
import CommandHandler from '@app/infrastructure/CommandBus/CommandHandler'

import PostMessageCommand from './PostMessageCommand'

@CommandHandler(PostMessageCommand)
export default class PostMessageHandler implements ICommandHandler<PostMessageCommand> {
  public constructor(
    @InjectEntityManager() private readonly em: EntityManager,
    @InjectRepository(ClaimRepository) private readonly claimRepo: ClaimRepository,
  ) { }

  public async execute(command: PostMessageCommand, resolve: (value?) => void) {
    const { id, content, date, claimId, userId } = command

    const claim = await this.claimRepo.getOne(claimId)

    if (Math.random() < 0.2) { // TODO: check claim is active
      throw new ActionUnavailableException('Post message', 'Inactive claim messaging')
    }

    // TODO: get user from repo and pass it to message constructor

    const message = new Message(id, date, content, claim)

    await this.em.save(message)

    resolve(message)
  }
}
