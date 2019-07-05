import { CommandHandler } from '@breadhead/nest-throwable-bus/dist'
import { Inject } from '@nestjs/common'
import { ICommandHandler } from '@nestjs/cqrs'
import { InjectEntityManager } from '@nestjs/typeorm'
import { EntityManager } from 'typeorm'

import NewFeedbackEvent from '@app/domain/feedback/event/NewFeedbackEvent'
import Feedback from '@app/domain/feedback/Feedback.entity'
import EventEmitter from '@app/infrastructure/events/EventEmitter'
import { IdGenerator } from '@app/utils/service/IdGenerator/IdGenerator'

import PostFeedbackCommand from './PostFeedbackCommand'

@CommandHandler(PostFeedbackCommand)
export default class PostFeedbackHandler
  implements ICommandHandler<PostFeedbackCommand> {
  public constructor(
    @InjectEntityManager() private readonly em: EntityManager,
    private readonly idGenerator: IdGenerator,
    private readonly eventEmitter: EventEmitter,
  ) {}

  public async execute(
    command: PostFeedbackCommand,
    resolve: (value?) => void,
  ) {
    const { name, content, theme, email, phone } = command

    const id = this.idGenerator.get()
    const date = new Date()

    const feedback = await this.em.save(
      new Feedback(id, date, name, content, theme, email, phone),
    )

    this.eventEmitter.emit(new NewFeedbackEvent(feedback))

    resolve(feedback)
  }
}
