import { Injectable } from '@nestjs/common'
import { TelegramClient } from 'nest-telegram'

import { Templating } from '@app/utils/service/Templating/Templating'
import Claim from '@app/domain/claim/Claim.entity'
import Message from '@app/domain/claim/Message.entity'
import { Configuration } from '@app/config/Configuration'

import Notificator from './Notificator'

@Injectable()
export default class TelegramNotificator implements Notificator {
  private siteUrl: string

  public constructor(
    private readonly telegramClient: TelegramClient,
    private readonly templating: Templating,
    config: Configuration,
  ) {
    this.siteUrl = config.get('SITE_URL').getOrElse('https://ask.nenaprasno.ru')
  }

  public async newChatMessageFromSpecialist(): Promise<void> {
    // SMS Notification not needed
  }

  public async newChatMessageFromClient(message: Message): Promise<void> {
    const { number, id, doctor } = message.claim

    if (!doctor.contacts.telegramId) {
      return
    }

    const text = await this.templating.render(
      'telegram/new-chat-message-from-client',
      {
        number,
        link: `${this.siteUrl}/doctor/consultation/${id}?openMessage`,
      },
    )

    await this.telegramClient.sendMarkdown(doctor.contacts.telegramId, text)
  }

  public async newFeedbackMessage(): Promise<void> {
    // SMS Notification not needed
  }

  public async claimRequiresWaiting(): Promise<void> {
    // SMS Notification not needed
  }

  public async claimSendToDoctor(claim: Claim): Promise<void> {
    const { number, id, doctor } = claim

    if (!doctor.contacts.telegramId) {
      return
    }

    const text = await this.templating.render('telegram/claim-send-to-doctor', {
      number,
      link: `${this.siteUrl}/doctor/consultation/${id}`,
    })

    await this.telegramClient.sendMarkdown(doctor.contacts.telegramId, text)
  }

  public async claimApproved(): Promise<void> {
    // SMS Notification not needed
  }

  public async feedbackAnswerSent(): Promise<void> {
    // SMS Notification not needed
  }

  public async shortClaimQueued(): Promise<void> {
    // SMS Notification not needed
  }

  public async claimRejected(): Promise<void> {
    // SMS Notification not needed
  }

  public async doctorAnswer(): Promise<void> {
    // SMS Notification not needed
  }
}
