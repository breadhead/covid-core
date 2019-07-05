import {
  MiddlewareConsumer,
  Module,
  NestModule,
  forwardRef,
} from '@nestjs/common'

import { ConfigModule } from '@app/config/config.module'
import { UtilsModule } from '@app/utils/utils.module'

import { SmsSender } from './service/SmsSender/SmsSender'
import { RedSmsSender } from './service/SmsSender/RedSmsSender'
import { EmailSender } from './service/EmailSender/EmailSender'
import { NodemailerEmailSender } from './service/EmailSender/NodemailerEmailSender'

@Module({
  imports: [forwardRef(() => ConfigModule), forwardRef(() => UtilsModule)],
  providers: [
    {
      provide: SmsSender,
      useClass: RedSmsSender,
    },
    {
      provide: EmailSender,
      useClass: NodemailerEmailSender,
    },
  ],
  exports: [SmsSender, EmailSender],
})
export class SenderModule implements NestModule {
  public configure(consumer: MiddlewareConsumer) {
    // pass
  }
}
