import { createTransport, Transporter } from 'nodemailer'

import Configuration from '../Configuration/Configuration'
import EmailSender, { MessageContent } from './EmailSender'

const SECURE_PORT = 587

export default class NodemailerEmailSender implements EmailSender {
  private readonly transporter: Transporter

  public constructor(config: Configuration) {
    const host = config.get('SMTP_HOST').getOrElse('localhost')
    const port = config.get('SMTP_PORT').map(Number).getOrElse(587)
    const auth = {
      user: config.get('SMTP_USER').getOrElse('admin'),
      pass: config.get('SMTP_PASSWORD').getOrElse('admin'),
    }

    this.transporter = createTransport({
      host, port, auth,
      secure: port === SECURE_PORT,
    })
  }

  public send(from: string, to: string, subject: string, content: MessageContent): Promise<void> {
    return this.transporter.sendMail({
      from, to, subject, ...content,
    })
  }
}
