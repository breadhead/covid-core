import { Inject } from '@nestjs/common'
import { ICommandHandler } from '@nestjs/cqrs'
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm'
import { EntityManager } from 'typeorm'

import Message from '@app/domain/claim/Message.entity'
import CommandHandler from '@app/infrastructure/CommandBus/CommandHandler'

import PostMessageCommand from './PostMessageCommand'

@CommandHandler(PostMessageCommand)
export default class PostMessageHandler implements ICommandHandler<PostMessageCommand> {
  public constructor(
    @InjectEntityManager() private readonly em: EntityManager,
  ) { }

  public async execute(command: PostMessageCommand, resolve: (value?) => void) {
    const { id, content, date, claimId, userId } = command

    // TODO: get claim from repo and pass it to message constructor
    // const claim = get
    // TODO: check claim is active

    // TODO: get user from repo and pass it to message constructor

    const message = new Message(id, date, content)

    await this.em.save(message)

    resolve(message)
  }
}
