import { Injectable } from '@nestjs/common'

import Claim from '@app/domain/claim/Claim.entity'
import Message from '@app/domain/claim/Message.entity'
import { Configuration } from '@app/config/Configuration'

import Notificator from './Notificator'
import { Templating } from '@app/utils/service/Templating/Templating'
import { SmsSender } from '@app/sender/service/SmsSender/SmsSender'
import { LinkShortener } from '@app/utils/service/LinkShortener/LinkShortener'
import { expertAnswersSmsUTM } from '@app/domain/claim/analysis/utmCodes'

@Injectable()
export default class SmsNotificator implements Notificator {
  private readonly send: (to: string, content: string) => Promise<void>
  private siteUrl: string

  public constructor(
    private readonly templating: Templating,
    private readonly linkShortener: LinkShortener,
    smsSender: SmsSender,
    config: Configuration,
  ) {
    this.send = (to, content) => smsSender.send(to, content)

    this.siteUrl = config.get('SITE_URL').getOrElse('localhost')
  }

  public async newChatMessageFromSpecialist(message: Message): Promise<void> {
    const { number, author, id } = message.claim
    const { name } = message.claim.applicant

    const link = await this.linkShortener.getShort(
      `${this.siteUrl}/client/consultation/${id}?openMessage`,
    )

    if (author.contacts.phone) {
      const text = await this.templating.render(
        'sms/new-chat-message-from-specialist',
        {
          link,
          number,
          name,
        },
      )

      await this.send(author.contacts.phone, text)
    }
  }

  public async closeWithoutAnswer(): Promise<void> {
    // SMS Notification not needed
  }

  public async newChatMessageFromClient(): Promise<void> {
    // SMS Notification not needed
  }

  public async newFeedbackMessage(): Promise<void> {
    // SMS Notification not needed
  }

  public async claimRequiresWaiting(): Promise<void> {
    // SMS Notification not needed
  }

  public async claimSendToDoctor(): Promise<void> {
    // SMS Notification not needed
  }

  public async claimApproved(): Promise<void> {
    // SMS Notification not needed
  }

  public async feedbackAnswerSent(): Promise<void> {
    // SMS Notification not needed
  }

  public async shortClaimQueued(claim: Claim): Promise<void> {
    const { number, author, id } = claim
    const { name } = claim.applicant

    const link = await this.linkShortener.getShort(
      `${this.siteUrl}/client/consultation/${id}`,
    )

    if (author.contacts.phone) {
      const text = await this.templating.render('sms/claim-queued', {
        link,
        number,
        name,
      })

      await this.send(author.contacts.phone, text)
    }
  }

  public async claimRejected(claim: Claim): Promise<void> {
    const { number, author, id } = claim
    const { name } = claim.applicant

    const link = await this.linkShortener.getShort(
      `${this.siteUrl}/client/consultation/${id}`,
    )

    if (author.contacts.phone) {
      const text = await this.templating.render('sms/claim-rejected', {
        link,
        number,
        name,
      })

      await this.send(author.contacts.phone, text)
    }
  }

  public async doctorAnswer(claim: Claim): Promise<void> {
    const { number, author, id } = claim
    const { name } = claim.applicant

    const link = await this.linkShortener.getShort(
      `${
        this.siteUrl
      }/client/consultation/${id}?${expertAnswersSmsUTM}#expert-answers`,
    )

    if (author.contacts.email) {
      const text = await this.templating.render('sms/doctor-answer', {
        link,
        number,
        name,
      })

      await this.send(author.contacts.phone, text)
    }
  }

  async claimAlmostOverdue(): Promise<void> {
    // SMS Notification not needed
  }
}
