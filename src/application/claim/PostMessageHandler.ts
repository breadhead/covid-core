import { CommandHandler } from '@breadhead/nest-throwable-bus'
import { Inject } from '@nestjs/common'
import { ICommandHandler } from '@nestjs/cqrs'
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm'
import { EntityManager } from 'typeorm'

import Claim from '@app/domain/claim/Claim.entity'
import ClaimRepository from '@app/domain/claim/ClaimRepository'
import Message from '@app/domain/claim/Message.entity'
import ActionUnavailableException from '@app/domain/exception/ActionUnavailableException'
import User from '@app/domain/user/User.entity'
import UserRepository from '@app/domain/user/UserRepository'
import EventEmitter from '@app/infrastructure/events/EventEmitter'

import NewMessageEvent from './NewMessageEvent'
import PostMessageCommand from './PostMessageCommand'
import ShortClaimApprovedEvent from './ShortClaimApprovedEvent'

@CommandHandler(PostMessageCommand)
export default class PostMessageHandler implements ICommandHandler<PostMessageCommand> {
  public constructor(
    @InjectEntityManager() private readonly em: EntityManager,
    @InjectRepository(ClaimRepository) private readonly claimRepo: ClaimRepository,
    @InjectRepository(UserRepository) private readonly userRepo: UserRepository,
    private readonly eventEmitter: EventEmitter,
  ) { }

  public async execute(command: PostMessageCommand, resolve: (value?) => void) {
    const { id, date, content, claimId, userLogin } = command

    const [ claim, user ] = await Promise.all([
      this.claimRepo.getOne(claimId),
      this.userRepo.getOne(userLogin),
    ])

    if (claim.isInactive()) {
      throw new ActionUnavailableException('Post message', 'Inactive claim messaging')
    }

    const message =  await this.em.save(
      new Message(id, date, content, claim, user),
    )

    this.eventEmitter.emit(new NewMessageEvent(message))

    this.eventEmitter.emit(new ShortClaimApprovedEvent(message.claim)) // TODO: moved to another place

    resolve(message)
  }
}