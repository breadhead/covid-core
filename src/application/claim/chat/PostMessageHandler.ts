import { CommandHandler } from '@breadhead/nest-throwable-bus'
import { ICommandHandler } from '@nestjs/cqrs'
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm'
import { EntityManager } from 'typeorm'

import { ClaimRepository } from '@app/domain/claim/ClaimRepository'
import NewMessageEvent from '@app/domain/claim/event/NewMessageEvent'
import Message from '@app/domain/claim/Message.entity'
import ActionUnavailableException from '@app/domain/exception/ActionUnavailableException'
import UserRepository from '@app/domain/user/UserRepository'
import EventEmitter from '@app/infrastructure/events/EventEmitter'

import PostMessageCommand from './PostMessageCommand'

@CommandHandler(PostMessageCommand)
export default class PostMessageHandler
  implements ICommandHandler<PostMessageCommand> {
  public constructor(
    @InjectEntityManager() private readonly em: EntityManager,
    private readonly claimRepo: ClaimRepository,
    @InjectRepository(UserRepository) private readonly userRepo: UserRepository,
    private readonly eventEmitter: EventEmitter,
  ) {}

  public async execute(command: PostMessageCommand, resolve: (value?) => void) {
    const { id, date, content, claimId, userLogin } = command

    const [claim, user] = await Promise.all([
      this.claimRepo.getOne(claimId),
      this.userRepo.getOne(userLogin),
    ])

    if (claim.isInactive() && user.isClient) {
      throw new ActionUnavailableException(
        'Post message',
        'Inactive claim messaging',
      )
    }

    const message = await this.em.save(
      new Message(id, date, content, claim, user),
    )

    this.eventEmitter.emit(new NewMessageEvent(message))

    resolve(message)
  }
}
