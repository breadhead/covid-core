import { Inject, Injectable } from '@nestjs/common'

import Claim from '@app/domain/claim/Claim.entity'
import Message from '@app/domain/claim/Message.entity'
import { Configuration } from '@app/config/Configuration'
import axios from 'axios'

import { SHORTENING_SERVICE } from './helpers'
import Notificator from './Notificator'
import { Templating } from '@app/utils/infrastructure/Templating/Templating'
import { SmsSender } from '@app/sender/infrastructure/SmsSender/SmsSender'

@Injectable()
export default class SmsNotificator implements Notificator {
  private readonly send: (to: string, content: string) => Promise<void>
  private siteUrl: string

  public constructor(
    smsSender: SmsSender,
    private readonly templating: Templating,
    config: Configuration,
  ) {
    this.send = (to, content) => smsSender.send(to, content)

    this.siteUrl = config.get('SITE_URL').getOrElse('localhost')
  }

  public async newChatMessageFromSpecialist(message: Message): Promise<void> {
    const { number, author, id } = message.claim
    const { name } = message.claim.applicant

    const link = await this.getShortLink(
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

    const link = await this.getShortLink(
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

    const link = await this.getShortLink(
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

    const link = await this.getShortLink(
      `${this.siteUrl}/client/consultation/${id}#expert-answers`,
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

  private async getShortLink(link: string): Promise<any> {
    // TODO: move to separate service
    return axios
      .get(`${SHORTENING_SERVICE}${link}`)
      .then(response => {
        return response.data
      })
      .catch(() => link)
  }
}
