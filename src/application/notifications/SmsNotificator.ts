import { Inject } from '@nestjs/common'

import Claim from '@app/domain/claim/Claim.entity'
import Message from '@app/domain/claim/Message.entity'
import Configuration from '@app/infrastructure/Configuration/Configuration'
import SmsSender, {
  SmsSender as SmsSenderSymbol,
} from '@app/infrastructure/SmsSender/SmsSender'
import TemplateEngine, {
  TemplateEngine as TemplateEngineSymbol,
} from '@app/infrastructure/TemplateEngine/TemplateEngine'
import axios from 'axios'

import SmsException from '../exception/SmsException'
import Notificator from './Notificator'

export default class SmsNotificator implements Notificator {
  private readonly send: (to: string, content: string) => Promise<void>
  private readonly defaultConext: object

  public constructor(
    @Inject(SmsSenderSymbol) smsSender: SmsSender,
    @Inject(TemplateEngineSymbol) private readonly templating: TemplateEngine,
    config: Configuration,
  ) {
    this.send = (to, content) => smsSender.send(to, content)

    const link = config.get('SITE_URL').getOrElse('localhost')
    let shortLink = null

    axios
      .get(`https://clck.ru/--?url=${link}`)
      .then(response => {
        shortLink = response.data
      })
      .catch(error => {
        throw new SmsException(error, link)
      })

    this.defaultConext = {
      link: shortLink || link,
    }
  }

  public async newChatMessageFromSpecialist(message: Message): Promise<void> {
    const { number, author } = message.claim
    const { name } = message.claim.applicant

    if (author.contacts.phone) {
      const text = await this.templating.render(
        'sms/new-chat-message-from-specialist',
        {
          ...this.defaultConext,
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

  public async shortClaimQueued(claim: Claim): Promise<void> {
    const { number, author } = claim
    const { name } = claim.applicant

    if (author.contacts.phone) {
      const text = await this.templating.render('sms/claim-queued', {
        ...this.defaultConext,
        number,
        name,
      })

      await this.send(author.contacts.phone, text)
    }
  }

  public async claimRejected(claim: Claim): Promise<void> {
    const { number, author } = claim
    const { name } = claim.applicant

    if (author.contacts.phone) {
      const text = await this.templating.render('sms/claim-rejected', {
        ...this.defaultConext,
        number,
        name,
      })

      await this.send(author.contacts.phone, text)
    }
  }

  public async doctorAnswer(claim: Claim): Promise<void> {
    const { number, author } = claim
    const { name } = claim.applicant

    if (author.contacts.email) {
      const text = await this.templating.render('sms/doctor-answer', {
        ...this.defaultConext,
        number,
        name,
      })

      await this.send(author.contacts.phone, text)
    }
  }
}
