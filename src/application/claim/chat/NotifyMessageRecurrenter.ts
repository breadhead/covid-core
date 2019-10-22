import { Inject, Injectable } from '@nestjs/common'
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm'
import { CronJob } from 'cron'
import { groupBy, head, random, sortBy } from 'lodash'
import { EntityManager } from 'typeorm'

import Notificator, {
  Notificator as NotificatorSymbol,
} from '@app/application/notifications/Notificator'
import Message from '@app/domain/claim/Message.entity'
import MessageRepository from '@app/domain/claim/MessageRepository'
import { Configuration } from '@app/config/Configuration'
import { Logger } from '@app/utils/service/Logger/Logger'

const wait = (ms: number) =>
  new Promise(resolve => {
    setTimeout(resolve, ms)
  })

@Injectable()
export class NotifyMessageRecurrenter {
  private readonly job: CronJob | null = null

  public constructor(
    @InjectRepository(MessageRepository)
    private readonly messageRepo: MessageRepository,
    private readonly logger: Logger,
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
    const messagerSorter = (message: Message) => message.date.valueOf()

    // Wait 10 sec, app initializing...
    await wait(10000)

    const messages = await this.messageRepo.findForNotification()

    const group = Object.values(
      groupBy(messages, (message: Message) => message.claim.id),
    )

    for (const messagesFromGroup of group) {
      const clientMessages = sortBy(
        messagesFromGroup.filter(message => message.user.isClient),
        messagerSorter,
      )

      const specialistMessages = sortBy(
        messagesFromGroup.filter(message => !message.user.isClient),
        messagerSorter,
      )

      const messageFromClient = head(clientMessages)
      const messageFromSpecialist = head(specialistMessages)

      const fromClientNotification = messageFromClient
        ? this.notificator.newChatMessageFromClient(messageFromClient)
        : Promise.resolve()

      const fromSpecialistNotification = messageFromSpecialist
        ? this.notificator.newChatMessageFromSpecialist(messageFromSpecialist)
        : Promise.resolve()

      // We pass the error because it's just notification
      const promises = [
        fromClientNotification.catch(this.logger.warn),
        fromSpecialistNotification.catch(() => {
          // pass
        }),
      ]

      // We must await in loop, becase want to send messages by chunks
      // eslint-disable-next-line no-await-in-loop
      await Promise.all(promises)
    }

    messages.forEach(message => message.markAsNotificated())

    await this.em.save(messages)
  }
}
