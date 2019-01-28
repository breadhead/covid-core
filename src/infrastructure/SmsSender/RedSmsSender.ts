import RedSmsClient from '@breadhead/red-sms-client'
import { Inject, Injectable } from '@nestjs/common'

import Configuration from '../Configuration/Configuration'
import Logger from '../Logger/Logger'
import SmsSender from './SmsSender'

@Injectable()
export default class RedSmsSender implements SmsSender {
  private redSmsClient: RedSmsClient

  public constructor(
    private readonly config: Configuration,
    private readonly logger: Logger,
  ) {
    const login = this.config.get('SMS_LOGIN').getOrElse('')

    const apiKey = this.config.get('SMS_API_KEY').getOrElse('')

    this.redSmsClient = new RedSmsClient(login, apiKey)
  }

  public async send(to: string, text: string): Promise<void> {
    if (this.config.isProd()) {
      await this.redSmsClient.sendSms('REDSMS.RU', to, text)
      this.logger.log(`SMS sent to "${to}"`)
    }

    if (this.config.isDev()) {
      this.logger.log(`Fake SMS sent, text: "${text}"`)
    }
  }
}
