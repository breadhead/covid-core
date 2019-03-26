import ClaimRepository from '@app/domain/claim/ClaimRepository'
import EventEmitter from '@app/infrastructure/events/EventEmitter'
import { Injectable } from '@nestjs/common'
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm'
import { CronJob } from 'cron'
import { EntityManager } from 'typeorm'

import FeedbackAnswerEvent from '@app/domain/claim/event/FeedbackAnswerEvent'

@Injectable()
export class FeedbackAnswerRecurrenter {
  private readonly job: CronJob

  public constructor(
    @InjectRepository(ClaimRepository)
    private readonly claimRepo: ClaimRepository,
    @InjectEntityManager() private readonly em: EntityManager,
    private readonly eventEmitter: EventEmitter,
  ) {
    this.job = new CronJob(
      `0 12 * * *`,
      () => {
        this.notify()
      },
      null,
      null,
      null,
      null,
      true,
    )
  }

  public async start() {
    this.job.start()
  }

  private async notify(): Promise<void> {
    const claims = await this.claimRepo.findClaimsForFeedbackReminder()
    claims.map(claim => {
      this.eventEmitter.emit(new FeedbackAnswerEvent(claim))
      claim.updateIsFeedbackReminderSent()
    })
    await this.em.save(claims)
  }
}
