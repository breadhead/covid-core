import { Inject, Injectable } from '@nestjs/common'
import { InjectEntityManager } from '@nestjs/typeorm'
import { CronJob } from 'cron'
import { chunk, random } from 'lodash'
import { EntityManager } from 'typeorm'

import Notificator, {
  Notificator as NotificatorSymbol,
} from '@app/application/notifications/Notificator'
import { Configuration } from '@app/config/Configuration'
import { ClaimRepository } from '@app/domain/claim/ClaimRepository'

const wait = (ms: number) =>
  new Promise(resolve => {
    setTimeout(resolve, ms)
  })

@Injectable()
export class NotifyOverdueRecurrenter {
  private readonly job: CronJob | null = null

  public constructor(
    private readonly claimRepo: ClaimRepository,
    @Inject(NotificatorSymbol) private readonly notificator: Notificator,
    @InjectEntityManager() private readonly em: EntityManager,
    config: Configuration,
  ) {
    if (config.isProd()) {
      // random minutes for every app instanse
      const minutes = random(1, 50, false)

      this.job = new CronJob(
        `${minutes} */3 * * *`,
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

    if (config.isDev()) {
      setInterval(() => this.notify(), 2000)
    }
  }

  public start() {
    if (this.job) {
      this.job.start()
    }
  }

  private async notify(): Promise<void> {
    // Wait 10 sec, app initializing...
    await wait(10000)

    const claims = await this.claimRepo.findAlmostOverdue()

    const groups = chunk(claims, 5)

    for (const claimGroup of groups) {
      await Promise.all(
        claimGroup.map(claim => this.notificator.claimAlmostOverdue(claim)),
      )
    }

    claims.forEach(claim => {
      // We can notify doctor only in Telegram
      // I know, it is abstraction leak
      // I have no time to fix it
      // Please, forgive me 😔
      if (claim.doctor.contacts.telegramId) {
        claim.overdueNotificated = true
      }
    })

    await this.em.save(claims)
  }
}
