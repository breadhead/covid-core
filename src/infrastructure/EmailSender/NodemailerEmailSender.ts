import { Injectable } from '@nestjs/common'
import { createTransport, getTestMessageUrl, Transporter } from 'nodemailer'

import Configuration from '../Configuration/Configuration'
import Logger from '../Logger/Logger'
import EmailSender, { MessageContent } from './EmailSender'

const SECURE_PORT = 587

@Injectable()
export default class NodemailerEmailSender implements EmailSender {
  private readonly transporter: Transporter

  public constructor(
    private readonly config: Configuration,
    private readonly logger: Logger,
  ) {
    const host = this.config.get('SMTP_HOST').getOrElse('localhost')
    const port = this.config.get('SMTP_PORT').map(Number).getOrElse(587)
    const auth = {
      user: this.config.get('SMTP_USER').getOrElse('admin'),
      pass: this.config.get('SMTP_PASSWORD').getOrElse('admin'),
    }

    this.transporter = createTransport({
      host, port, auth,
      secure: this.config.isProd() && port === SECURE_PORT,
    })
  }

  public async send(from: string, to: string, subject: string, content: MessageContent): Promise<void> {
    const result = await this.transporter.sendMail({
      from, to, subject, ...content,
    })

    if (this.config.isDev()) {
      this.logger.error(`Email sent to test server, url: ${getTestMessageUrl(result)}`)
    } else {
      this.logger.log(`Email sent to "${to}"`)
    }
  }
}
