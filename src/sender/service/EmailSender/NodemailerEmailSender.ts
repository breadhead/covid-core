import { Injectable } from '@nestjs/common'
import { createTransport, getTestMessageUrl, Transporter } from 'nodemailer'

import { Configuration } from '@app/config/Configuration'
import { Logger } from '@app/utils/service/Logger/Logger'

import { EmailSender } from './EmailSender'
import { MessageContent } from './MessageContent'

const SECURE_PORT = 587

@Injectable()
export class NodemailerEmailSender implements EmailSender {
  private readonly transporter: Transporter

  public constructor(
    private readonly config: Configuration,
    private readonly logger: Logger,
  ) {
    const host = this.config.get('SMTP_HOST').getOrElse('localhost')
    const port = this.config.getNumber('SMTP_PORT').getOrElse(587)
    const auth = {
      user: this.config.get('SMTP_USER').getOrElse('admin'),
      pass: this.config.get('SMTP_PASSWORD').getOrElse('admin'),
    }

    this.transporter = createTransport({
      host,
      port,
      auth,
      secure: false,
    })
  }

  public async send(
    from: string,
    to: string,
    subject: string,
    content: MessageContent,
  ): Promise<void> {
    const result = await this.transporter.sendMail({
      from,
      to,
      subject,
      ...content,
    })

    if (this.config.isDev()) {
      this.logger.log(
        `Email sent to test server, url: ${getTestMessageUrl(result)}`,
      )
    } else {
      this.logger.log(`Email sent to "${to}"`)
    }
  }
}
