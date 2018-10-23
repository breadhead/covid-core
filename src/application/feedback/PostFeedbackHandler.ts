import { CommandHandler } from '@breadhead/nest-throwable-bus/dist'
import { Inject } from '@nestjs/common'
import { ICommandHandler } from '@nestjs/cqrs'
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm'
import { EntityManager } from 'typeorm'

import Feedback from 'domain/feedback/Feedback.entity'
import EventEmitter from 'infrastructure/events/EventEmitter'
import IdGenerator, { IdGenerator as IdGeneratorSymbol } from 'infrastructure/IdGenerator/IdGenerator'

import NewFeedbackEvent from './NewFeedbackEvent'
import PostFeedbackCommand from './PostFeedbackCommand'

@CommandHandler(PostFeedbackCommand)
export default class PostFeedbackHandler implements ICommandHandler<PostFeedbackCommand> {
  public constructor(
    @InjectEntityManager() private readonly em: EntityManager,
    @Inject(IdGeneratorSymbol) private readonly idGenerator: IdGenerator,
    private readonly eventEmitter: EventEmitter,
  ) { }

  public async execute(command: PostFeedbackCommand, resolve: (value?) => void) {
    const { name, content, theme, email, phone } = command

    const id = this.idGenerator.get()
    const date = new Date()

    const feedback =  await this.em.save(
      new Feedback(id, date, name, content, theme, email, phone),
    )

    this.eventEmitter.emit(new NewFeedbackEvent(feedback))

    resolve(feedback)
  }
}
