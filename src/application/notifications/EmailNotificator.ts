import { Inject } from '@nestjs/common'

import Message from '@app/domain/claim/Message.entity'
import User from '@app/domain/user/User.entity'
import EmailSender, { EmailSender as EmailSenderSymbol } from '@app/infrastructure/EmailSender/EmailSender'
import TemplateEngine, {
  TemplateEngine as TemplateEngineSymbol,
} from '@app/infrastructure/TemplateEngine/TemplateEngine'

import Notificator from './Notificator'

export default class EmailNotificator implements Notificator {
  public constructor(
    @Inject(EmailSenderSymbol) private readonly sender: EmailSender,
    @Inject(TemplateEngineSymbol) private readonly templating: TemplateEngine,
  ) { }

  public async newMessage(message: Message): Promise<void> {
    const html = await this.templating.render('email/new-message', { text: message.content })

    return this.sender.send('s', 'igor@kamyshev.me', 'ds', { html })
  }
}
