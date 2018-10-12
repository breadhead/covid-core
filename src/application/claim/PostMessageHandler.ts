import { CommandHandler } from '@breadhead/nest-throwable-bus'
import { ICommandHandler } from '@nestjs/cqrs'
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm'
import { EntityManager } from 'typeorm'

import ClaimRepository from '@app/domain/claim/ClaimRepository'
import Message from '@app/domain/claim/Message.entity'
import ActionUnavailableException from '@app/domain/exception/ActionUnavailableException'
import UserRepository from '@app/domain/user/UserRepository'

import PostMessageCommand from './PostMessageCommand'

@CommandHandler(PostMessageCommand)
export default class PostMessageHandler implements ICommandHandler<PostMessageCommand> {
  public constructor(
    @InjectEntityManager() private readonly em: EntityManager,
    @InjectRepository(ClaimRepository) private readonly claimRepo: ClaimRepository,
    @InjectRepository(UserRepository) private readonly userRepo: UserRepository,
  ) { }

  public async execute(command: PostMessageCommand, resolve: (value?) => void) {
    const { id, content, date, claimId, userId } = command

    const [ claim, user ] = await Promise.all([
      this.claimRepo.getOne(claimId),
      this.userRepo.getOne(userId),
    ])

    if (claim.isInactive()) {
      throw new ActionUnavailableException('Post message', 'Inactive claim messaging')
    }

    const message = new Message(id, date, content, claim, user)

    await this.em.save(message)

    resolve(message)
  }
}
