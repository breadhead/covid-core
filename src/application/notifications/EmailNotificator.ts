import Feedback from '@app/domain/feedback/Feedback.entity'
import { Inject } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'

import Claim from '@app/domain/claim/Claim.entity'
import Message from '@app/domain/claim/Message.entity'
import UserRepository from '@app/domain/user/UserRepository'
import Configuration from '@app/infrastructure/Configuration/Configuration'
import EmailSender, {
  EmailSender as EmailSenderSymbol,
  MessageContent,
} from '@app/infrastructure/EmailSender/EmailSender'
import TemplateEngine, {
  TemplateEngine as TemplateEngineSymbol,
} from '@app/infrastructure/TemplateEngine/TemplateEngine'

import Notificator from './Notificator'

export default class EmailNotificator implements Notificator {
  private readonly send: (
    to: string,
    subject: string,
    content: MessageContent,
  ) => Promise<void>
  private siteUrl: string

  public constructor(
    @Inject(TemplateEngineSymbol) private readonly templating: TemplateEngine,
    @Inject(EmailSenderSymbol) sender: EmailSender,
    @InjectRepository(UserRepository) private readonly userRepo: UserRepository,
    config: Configuration,
  ) {
    const senderEmail = config
      .get('ONCOHELP_SENDER_EMAIL')
      .getOrElse('oncohelp@email.com')

    this.send = (to, subject, content) =>
      sender.send(senderEmail, to, subject, content)

    this.siteUrl = config.get('SITE_URL').getOrElse('localhost')
  }

  public async newChatMessageFromSpecialist(message: Message): Promise<void> {
    const { id, author } = message.claim
    const { name } = message.claim.applicant
    const subject = `${name}, посмотрите новое сообщение по вашей заявке на консультацию`

    const html = await this.templating.render(
      'email/new-chat-message-from-specialist',
      {
        name,
        link: `${this.siteUrl}/consultation/redirect/${id}`, // TODO: check url after frontend
      },
    )

    if (author.contacts.email) {
      return this.send(author.contacts.email, subject, { html })
    }
  }

  public async newChatMessageFromClient(message: Message): Promise<void> {
    const { id, status } = message.claim
    const { name } = message.claim.applicant
    const subject = `Новое сообщение в заявке ${id}, ${name}`

    const [html, caseManager] = await Promise.all([
      this.templating.render('email/new-chat-message-from-client', {
        name,
        id,
        status,
        link: `${this.siteUrl}/consultation/redirect/${id}`,
        text: message.content,
      }),
      this.userRepo.findCaseManager(),
    ])

    if (caseManager.contacts.email) {
      return this.send(caseManager.contacts.email, subject, { html })
    }
  }

  public async newFeedbackMessage(feedback: Feedback): Promise<void> {
    const { content, name, theme, email, phone } = feedback

    const subject = `Сообщение "${theme}" от ${name}`

    const [html, caseManager] = await Promise.all([
      this.templating.render('email/new-feedback-message', {
        name,
        email,
        phone,
        theme,
        content,
      }),
      this.userRepo.findCaseManager(),
    ])

    if (caseManager.contacts.email) {
      return this.send(caseManager.contacts.email, subject, { html })
    }
  }

  public async shortClaimApproved(claim: Claim): Promise<void> {
    const { id, status, author, due } = claim
    const { name } = claim.applicant

    const subject = `${name}, пожалуйста, продолжите заполнение заявки на консультацию`

    const html = await this.templating.render(
      'email/short-claim-message-approved',
      {
        name,
        status,
        date: due.toLocaleString(),
        link: `${this.siteUrl}/consultation/redirect/${id}`,
      },
    )

    if (author.contacts.email) {
      return this.send(author.contacts.email, subject, { html })
    }
  }

  public async shortClaimQueued(claim: Claim): Promise<void> {
    const { id, status, author, due } = claim
    const { name } = claim.applicant

    const subject = `${name}, ваша заявка поставлена в очередь на бесплатную консультацию`

    const html = await this.templating.render(
      'email/short-claim-message-queued',
      {
        name,
        status,
        date: due.toLocaleString(),
        link: `${this.siteUrl}/consultation/redirect/${id}`,
      },
    )

    if (author.contacts.email) {
      return this.send(author.contacts.email, subject, { html })
    }
  }

  public async claimRejected(claim: Claim): Promise<void> {
    const { id, author } = claim
    const { name } = claim.applicant

    const subject = `${name}, к сожалению, ваша заявка отклонена`

    const html = await this.templating.render('email/claim-rejected', {
      name,
      link: `${this.siteUrl}/consultation/redirect/${id}`,
    })

    if (author.contacts.email) {
      return this.send(author.contacts.email, subject, { html })
    }
  }

  public async doctorAnswer(claim: Claim): Promise<void> {
    const { id, author } = claim
    const { name } = claim.applicant

    const subject = `${name}, готов ответ специалиста по вашей консультации`

    const html = await this.templating.render('email/doctor-answer', {
      name,
      link: `${this.siteUrl}/consultation/redirect/${id}`,
    })

    if (author.contacts.email) {
      return this.send(author.contacts.email, subject, { html })
    }
  }
}
