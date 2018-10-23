import Feedback from '@app/domain/feedback/Feedback.entity'
import { Inject } from '@nestjs/common'

import Message from '@app/domain/claim/Message.entity'
import Configuration from '@app/infrastructure/Configuration/Configuration'
import EmailSender, {
  EmailSender as EmailSenderSymbol, MessageContent,
} from '@app/infrastructure/EmailSender/EmailSender'
import TemplateEngine, {
  TemplateEngine as TemplateEngineSymbol,
} from '@app/infrastructure/TemplateEngine/TemplateEngine'
import Claim from 'domain/claim/Claim.entity'
import Notificator from './Notificator'

export default class EmailNotificator implements Notificator {
  private readonly send: (from: string, subject: string, content: MessageContent) => Promise<void>
  private siteUrl: string

  public constructor(
    @Inject(TemplateEngineSymbol) private readonly templating: TemplateEngine,
    @Inject(EmailSenderSymbol) sender: EmailSender,
    config: Configuration,
  ) {
    const senderEmail = config
      .get('ONCOHELP_SENDER_EMAIL')
      .getOrElse('oncohelp@email.com')

    this.send = (from, subject, content) =>
      sender.send(senderEmail, from, subject, content)

    this.siteUrl = config
      .get('SITE_URL')
      .getOrElse('localhost')
  }

  public async newChatMessage(message: Message): Promise<void> {
    const { id, status } = message.claim
    const { name } = message.claim.applicant
    const subject = `Новое сообщение в заявке N ${id}, ${name}`

    const html = await this.templating.render('email/new-chat-message', {
      name,
      number: id,
      status,
      link: `${this.siteUrl}/claim/${id}`, // TODO: check url after frontend
      text: message.content,
    })

    return this.send('igor@kamyshev.me', subject, { html })
  }

  public async newFeedbackMessage(feedback: Feedback): Promise<void> {
    const { content, name, theme, email, phone } = feedback

    const subject = `Сообщение "${theme}" от ${name}`

    const html = await this.templating.render('email/new-feedback-message', {
      name,
      email,
      phone,
      theme,
      content,
    })

    return this.send('igor@kamyshev.me', subject, { html })
  }

  public async shortClaimApproved(claim: Claim): Promise<void> {
    const { id, status } = claim
    const { name } = claim.applicant

    const subject = `${name}, пожалуйста, продолжите заполнение заявки на консультацию`

    const html = await this.templating.render('email/short-claim-message-approved', {
      name,
      status,
      date: new Date().toLocaleString(), // TODO: change to real date
      link: `${this.siteUrl}/claim/${id}`, // TODO: check url after frontend
    })

    return this.send('igor@kamyshev.me', subject, { html })
  }

  public async shortClaimQueued(claim: Claim): Promise<void> {
    const { id, status } = claim
    const { name } = claim.applicant

    const subject = `${name}, ваша заявка поставлена в очередь на бесплатную консультацию`

    const html = await this.templating.render('email/short-claim-message-queued', {
      name,
      status,
      date: new Date().toLocaleString(), // TODO: change to real date
      link: `${this.siteUrl}/claim/${id}`, // TODO: check url after frontend
    })

    return this.send('igor@kamyshev.me', subject, { html })
  }

  public async claimRejected(claim: Claim): Promise<void> {
    const { id } = claim
    const { name } = claim.applicant

    const subject = `${name}, к сожалению, ваша заявка отклонена`

    const html = await this.templating.render('email/claim-rejected', {
      name,
      link: `${this.siteUrl}/claim/${id}`, // TODO: check url after frontend
    })

    return this.send('igor@kamyshev.me', subject, { html })
  }
}
