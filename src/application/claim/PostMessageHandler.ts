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

import Notificator, { Notificator as NotificatorSymbol } from '../notifications/Notificator'
import NewMessageEvent from './NewMessageEvent'
import PostMessageCommand from './PostMessageCommand'

@CommandHandler(PostMessageCommand)
export default class PostMessageHandler implements ICommandHandler<PostMessageCommand> {
  public constructor(
    @InjectEntityManager() private readonly em: EntityManager,
    @InjectRepository(ClaimRepository) private readonly claimRepo: ClaimRepository,
    @InjectRepository(UserRepository) private readonly userRepo: UserRepository,
    @Inject(NotificatorSymbol) private readonly notificator: Notificator,
    private readonly eventEmitter: EventEmitter,
  ) { }

  public async execute(command: PostMessageCommand, resolve: (value?) => void) {
    const { claimId, userLogin, ...messageBody } = command

    const [ claim, user ] = await Promise.all([
      this.claimRepo.getOne(claimId),
      this.userRepo.getOne(userLogin),
    ])

    const message = await this.saveMessage(messageBody, claim, user)

    await this.notificator.newMessage(user, message)

    this.eventEmitter.emit(new NewMessageEvent(message))

    resolve(message)
  }

  private saveMessage({ id, content, date }, claim: Claim, user: User): Promise<Message> {
    if (claim.isInactive()) {
      throw new ActionUnavailableException('Post message', 'Inactive claim messaging')
    }

    const message = new Message(id, date, content, claim, user)

    return this.em.save(message)
  }
}
