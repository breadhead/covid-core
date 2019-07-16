import { Injectable } from '@nestjs/common'
import {
  TelegramModuleOptionsFactory,
  TelegramModuleOptions,
} from 'nest-telegram'

import { Configuration } from '@app/config/Configuration'

@Injectable()
export class TelegramOptionsFactory implements TelegramModuleOptionsFactory {
  private readonly token: string
  private readonly sitePublicUrl?: string = undefined

  public constructor(config: Configuration) {
    this.token = config.getStringOrThrow('TELEGRAM_BOT_TOKEN')

    if (config.isProd()) {
      this.sitePublicUrl = config.getStringOrElse(
        'API_PUBLIC_URL',
        'https://api.oncohelp.breadhead.ru',
      )
    }
  }

  public createOptions(): TelegramModuleOptions {
    return {
      token: this.token,
      sitePublicUrl: this.sitePublicUrl,
    }
  }
}
