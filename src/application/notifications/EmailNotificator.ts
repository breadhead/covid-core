import Feedback from '@app/domain/feedback/Feedback.entity'

import Claim, { ClaimStatus } from '@app/domain/claim/Claim.entity'
import Message from '@app/domain/claim/Message.entity'
import { Configuration } from '@app/config/Configuration'
import Notificator from './Notificator'

import { formatDate } from './helpers'
import { Templating } from '@app/utils/service/Templating/Templating'
import { StyleInliner } from '@app/utils/service/Templating/processors/StyleInliner'
import { Context } from '@app/utils/service/Templating/Context'
import { MessageContent } from '@app/sender/service/EmailSender/MessageContent'
import { EmailSender } from '@app/sender/service/EmailSender/EmailSender'
import { UserRepository } from '@app/user/service/UserRepository'
import { Injectable } from '@nestjs/common'
import {
  expertAnswersEmailUTM,
  finishYesUTM,
  finishNoUTM,
} from '@app/domain/claim/analysis/utmCodes'

@Injectable()
export default class EmailNotificator implements Notificator {
  private readonly send: (
    to: string,
    subject: string,
    content: MessageContent,
  ) => Promise<void>
  private siteUrl: string

  private senderEmail: string

  private readonly renderHtml: (
    template: string,
    context: Context,
  ) => Promise<string>

  public constructor(
    templating: Templating,
    styleInliner: StyleInliner,
    sender: EmailSender,
    config: Configuration,
    private readonly userRepo: UserRepository,
  ) {
    this.senderEmail = config
      .get('ONCOHELP_SENDER_EMAIL')
      .getOrElse('oncohelp@email.com')

    this.send = (to, subject, content) =>
      sender.send(`Просто спросить <${this.senderEmail}>`, to, subject, content)

    this.siteUrl = config.get('SITE_URL').getOrElse('localhost')

    this.renderHtml = templating.createRender([styleInliner])
  }

  public async newChatMessageFromSpecialist(message: Message): Promise<void> {
    const { number, author, id } = message.claim
    const { name } = message.claim.applicant
    const subject = `Заявка №${number}. ${name}, посмотрите новое сообщение по вашей заявке на консультацию`

    const html = await this.renderHtml(
      'email/new-chat-message-from-specialist',
      {
        siteUrl: this.siteUrl,
        name,
        link: `${this.siteUrl}/client/consultation/${id}?openMessage`,
        number,
      },
    )

    if (author.contacts.email) {
      await this.send(author.contacts.email, subject, { html })
    }
  }

  public async newChatMessageFromClient(message: Message): Promise<void> {
    const { number, status, doctor, id } = message.claim
    const { name } = message.claim.applicant
    const subject = `Новое сообщение в заявке №${number}, ${name}`

    const [html, caseManager] = await Promise.all([
      this.renderHtml('email/new-chat-message-from-client', {
        siteUrl: this.siteUrl,
        name,
        number,
        status,
        link: `${this.siteUrl}/manager/consultation/${id}?openMessage`,
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
    const { content, name, theme, email, phone } = feedback

    const subject = `Сообщение "${theme}" от ${name}`

    const html = await this.renderHtml('email/new-feedback-message', {
      siteUrl: this.siteUrl,
      name,
      email,
      phone,
      theme,
      content,
    })

    return this.send(this.senderEmail, subject, { html })
  }

  public async claimApproved(claim: Claim): Promise<void> {
    const { number, author } = claim
    const { name } = claim.applicant

    const subject = `Заявка №${number}. ${name}, мы получили вашу заявку`

    const html = await this.renderHtml('email/claim-approved', {
      siteUrl: this.siteUrl,
      name,
      number,
    })

    if (author.contacts.email) {
      await this.send(author.contacts.email, subject, { html })
    }
  }

  public async claimRequiresWaiting(claim: Claim): Promise<void> {
    const { number, author } = claim
    const { name } = claim.applicant

    const subject = `Заявка №${number}. ${name}, ваша заявка поставлена в очередь`

    const html = await this.renderHtml('email/claim-requires-waiting', {
      siteUrl: this.siteUrl,
      name,
      number,
    })

    if (author.contacts.email) {
      await this.send(author.contacts.email, subject, { html })
    }
  }

  public async claimSendToDoctor(claim: Claim): Promise<void> {
    const { number, author } = claim
    const { name } = claim.applicant

    const subject = `Заявка №${number}. ${name}, ваша заявка передана эксперту`

    const html = await this.renderHtml('email/claim-send-to-doctor', {
      siteUrl: this.siteUrl,
      name,
      number,
    })

    if (author.contacts.email) {
      await this.send(author.contacts.email, subject, { html })
    }
  }

  public async shortClaimQueued(claim: Claim): Promise<void> {
    const { number, status, author, due } = claim
    const { name } = claim.applicant

    const subject = `Заявка №${number}. ${name}, ваша заявка поставлена в очередь на бесплатную консультацию`

    const html = await this.renderHtml('email/short-claim-message-queued', {
      siteUrl: this.siteUrl,
      name,
      status,
      date: formatDate(due),
      number,
    })

    if (author.contacts.email) {
      await this.send(author.contacts.email, subject, { html })
    }
  }

  public async claimRejected(claim: Claim): Promise<void> {
    const { number, author, closeComment } = claim
    const { name } = claim.applicant
    const subject = `Заявка №${number}. ${name}, к сожалению, ваша заявка отклонена`
    const html = await this.renderHtml('email/claim-rejected', {
      siteUrl: this.siteUrl,
      name,
      link: `${this.siteUrl}/contacts#feedback-form`,
      number,
      closeComment,
    })
    if (author.contacts.email) {
      await this.send(author.contacts.email, subject, { html })
    }
  }

  public async doctorAnswer(claim: Claim): Promise<void> {
    const { number, author, id } = claim
    const { name } = claim.applicant

    const subject = `Заявка №${number}. ${name}, готов ответ эксперта по вашей консультации`

    const html = await this.renderHtml('email/doctor-answer', {
      siteUrl: this.siteUrl,
      name,
      link: `${
        this.siteUrl
      }/client/consultation/${id}?${expertAnswersEmailUTM}#expert-answers`,
      number,
    })

    if (author.contacts.email) {
      await this.send(author.contacts.email, subject, { html })
    }
  }

  public async feedbackAnswerSent(claim: Claim): Promise<void> {
    const { number, author, id } = claim
    const { name } = claim.applicant

    const subject = `Заявка №${number}. ${name}, эксперт понятно ответил на ваши вопросы?`

    const html = await this.renderHtml('email/feedback-answer', {
      siteUrl: this.siteUrl,
      name,
      link: `${this.siteUrl}/client/consultation/${id}#feedback`,
      number,
      yesLink: `${
        this.siteUrl
      }/client/consultation/${id}?donation&${finishYesUTM}`,
      noLink: `${
        this.siteUrl
      }/client/consultation/${id}?openMessage&${finishNoUTM}`,
    })

    if (author.contacts.email) {
      await this.send(author.contacts.email, subject, { html })
    }
  }

  async claimAlmostOverdue(): Promise<void> {
    // Email Notification not needed
  }
}
