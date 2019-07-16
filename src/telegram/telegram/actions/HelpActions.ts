import { Injectable } from '@nestjs/common'
import { Context, TelegramActionHandler } from 'nest-telegram'

import { Templating } from '@app/utils/service/Templating/Templating'

@Injectable()
export class HelpActions {
  public constructor(private readonly templating: Templating) {}

  @TelegramActionHandler({ onStart: true })
  async start(ctx: Context) {
    await this.sendHelpText(ctx)
  }

  @TelegramActionHandler({ command: '/help' })
  async help(ctx: Context) {
    await this.sendHelpText(ctx)
  }

  private async sendHelpText(ctx: Context) {
    const responseText = await this.templating.render('telegram/help', {})

    await ctx.reply(responseText)
  }
}
