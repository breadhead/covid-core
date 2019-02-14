import Feedback from '@app/domain/feedback/Feedback.entity'
import { Inject } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'

import Claim, { ClaimStatus } from '@app/domain/claim/Claim.entity'
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

import StyleInlinerProcessor from '@app/infrastructure/TemplateEngine/processors/StyleInlinerProcessor'
import Notificator from './Notificator'

import { formatDate } from './helpers'
export default class EmailNotificator implements Notificator {
  private readonly send: (
    to: string,
    subject: string,
    content: MessageContent,
  ) => Promise<void>
  private siteUrl: string

  private senderEmail: string

  public constructor(
    @Inject(TemplateEngineSymbol) private readonly templating: TemplateEngine,
    @Inject(EmailSenderSymbol) sender: EmailSender,
    @InjectRepository(UserRepository) private readonly userRepo: UserRepository,
    config: Configuration,
  ) {
    this.senderEmail = config
      .get('ONCOHELP_SENDER_EMAIL')
      .getOrElse('oncohelp@email.com')

    this.send = (to, subject, content) =>
      sender.send(this.senderEmail, to, subject, content)

    this.siteUrl = config.get('SITE_URL').getOrElse('localhost')

    this.templating.addProcessor(new StyleInlinerProcessor())
  }

  public async newChatMessageFromSpecialist(message: Message): Promise<void> {
    const { id, author } = message.claim
    const { name } = message.claim.applicant
    const subject = `Заявка №${id}. ${name}, посмотрите новое сообщение по вашей заявке на консультацию`

    const html = await this.templating.render(
      'email/new-chat-message-from-specialist',
      {
        siteUrl: this.siteUrl,
        name,
        link: `${this.siteUrl}/client/consultation/${id}`,
        id,
      },
    )

    if (author.contacts.email) {
      return this.send(author.contacts.email, subject, { html })
    }
  }

  public async newChatMessageFromClient(message: Message): Promise<void> {
    const { id, status, doctor } = message.claim
    const { name } = message.claim.applicant
    const subject = `Новое сообщение в заявке №${id}, ${name}`

    const [html, caseManager] = await Promise.all([
      this.templating.render('email/new-chat-message-from-client', {
        siteUrl: this.siteUrl,
        name,
        id,
        status,
        link: `${this.siteUrl}/manager/consultation/${id}`,
        text: message.content,
      }),
      this.userRepo.findCaseManager(),
    ])

    const notifyCaseManager = () => {
      const caseManagerEmail = caseManager.login

      return this.send(caseManagerEmail, subject, { html })
    }

    const notifyDoctor = () => {
      const STATUSES_FOR_DOCTOR_NOTIFICATION = [
        ClaimStatus.AtTheDoctor,
        ClaimStatus.AnswerValidation,
        ClaimStatus.DeliveredToCustomer,
      ]

      if (!STATUSES_FOR_DOCTOR_NOTIFICATION.includes(status) || !doctor) {
        return Promise.resolve()
      }

      const doctorEmail = doctor.login

      return this.send(doctorEmail, subject, { html })
    }

    await Promise.all([notifyCaseManager(), notifyDoctor()])
  }

  public async newFeedbackMessage(feedback: Feedback): Promise<void> {
    const { content, name, theme, email, phone, id } = feedback

    const subject = `Заявка №${id}. Сообщение "${theme}" от ${name}`

    const html = await this.templating.render('email/new-feedback-message', {
      siteUrl: this.siteUrl,
      name,
      email,
      phone,
      theme,
      content,
      id,
    })

    return this.send(this.senderEmail, subject, { html })
  }

  public async shortClaimApproved(claim: Claim): Promise<void> {
    const { id, status, author, due } = claim
    const { name } = claim.applicant

    const subject = `Заявка №${id}.${name}, пожалуйста, продолжите заполнение заявки на консультацию`

    const html = await this.templating.render(
      'email/short-claim-message-approved',
      {
        siteUrl: this.siteUrl,
        name,
        status,
        date: formatDate(due),
        link: `${this.siteUrl}/client/claim/${id}/situation`,
        id,
      },
    )

    if (author.contacts.email) {
      return this.send(author.contacts.email, subject, { html })
    }
  }

  public async shortClaimQueued(claim: Claim): Promise<void> {
    const { id, status, author, due } = claim
    const { name } = claim.applicant

    const subject = `Заявка №${id}. ${name}, ваша заявка поставлена в очередь на бесплатную консультацию`

    const html = await this.templating.render(
      'email/short-claim-message-queued',
      {
        siteUrl: this.siteUrl,
        name,
        status,
        date: formatDate(due),
        id,
      },
    )

    if (author.contacts.email) {
      return this.send(author.contacts.email, subject, { html })
    }
  }

  public async claimRejected(claim: Claim): Promise<void> {
    const { id, author } = claim
    const { name } = claim.applicant

    const subject = `Заявка №${id}. ${name}, к сожалению, ваша заявка отклонена`

    const html = await this.templating.render('email/claim-rejected', {
      siteUrl: this.siteUrl,
      name,
      link: `${this.siteUrl}/contacts#feedback-form`,
      id,
    })

    if (author.contacts.email) {
      return this.send(author.contacts.email, subject, { html })
    }
  }

  public async doctorAnswer(claim: Claim): Promise<void> {
    const { id, author } = claim
    const { name } = claim.applicant

    const subject = `Заявка №${id}.${name}, готов ответ специалиста по вашей консультации`

    const html = await this.templating.render('email/doctor-answer', {
      siteUrl: this.siteUrl,
      name,
      link: `${this.siteUrl}/client/consultation/${id}#expert-answers`,
      id,
    })

    if (author.contacts.email) {
      return this.send(author.contacts.email, subject, { html })
    }
  }
}
