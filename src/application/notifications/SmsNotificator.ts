import { Inject } from '@nestjs/common'

import Claim from '@app/domain/claim/Claim.entity'
import Message from '@app/domain/claim/Message.entity'
import SmsSender, {
  SmsSender as SmsSenderSymbol,
} from '@app/infrastructure/SmsSender/SmsSender'

import Notificator from './Notificator'

export default class SmsNotificator implements Notificator {
  private readonly send: (to: string, content: string) => Promise<void>

  public constructor(@Inject(SmsSenderSymbol) smsSender: SmsSender) {
    this.send = (to, content) => smsSender.send(to, content)
  }

  public async newChatMessageFromSpecialist(message: Message): Promise<void> {
    const { number, author } = message.claim
    const { name } = message.claim.applicant

    const text = `Заявка №${number}. ${name}, посмотрите новое сообщение по вашей заявке на консультацию`

    if (author.contacts.phone) {
      return this.send(author.contacts.phone, text)
    }
  }

  public async newChatMessageFromClient(): Promise<void> {
    // SMS Notification not needed
    return Promise.resolve()
  }

  public async newFeedbackMessage(): Promise<void> {
    // SMS Notification not needed
    return Promise.resolve()
  }

  public async shortClaimApproved(claim: Claim): Promise<void> {
    const { number, status, author, due, id } = claim
    const { name } = claim.applicant

    const text = `Заявка №${number}. ${name}, пожалуйста, продолжите заполнение заявки на консультацию`

    if (author.contacts.phone) {
      return this.send(author.contacts.phone, text)
    }
  }

  public async shortClaimQueued(claim: Claim): Promise<void> {
    const { number, status, author, due } = claim
    const { name } = claim.applicant

    const text = `Заявка №${number}. ${name}, ваша заявка поставлена в очередь на бесплатную консультацию`

    if (author.contacts.phone) {
      return this.send(author.contacts.phone, text)
    }
  }

  public async claimRejected(claim: Claim): Promise<void> {
    const { number, author } = claim
    const { name } = claim.applicant

    const text = `Заявка №${number}. ${name}, к сожалению, ваша заявка отклонена`

    if (author.contacts.phone) {
      return this.send(author.contacts.phone, text)
    }
  }

  public async doctorAnswer(claim: Claim): Promise<void> {
    const { number, author, id } = claim
    const { name } = claim.applicant

    const text = `Заявка №${number}. ${name}, готов ответ специалиста по вашей консультации`

    if (author.contacts.email) {
      return this.send(author.contacts.phone, text)
    }
  }
}
