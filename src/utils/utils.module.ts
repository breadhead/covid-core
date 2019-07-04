import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common'

import { PasswordEncoder } from './infrastructure/PasswordEncoder/PasswordEncoder'
import { BcryptPasswordEncoder } from './infrastructure/PasswordEncoder/BcryptPasswordEncoder'
import { IdGenerator } from './infrastructure/IdGenerator/IdGenerator'
import { NanoIdGenerator } from './infrastructure/IdGenerator/NanoIdGenerator'
import { Templating } from './infrastructure/Templating/Templating'
import { TwigTemplating } from './infrastructure/Templating/TwigTemplating'
import { StyleInliner } from './infrastructure/Templating/processors/StyleInliner'

@Module({
  providers: [
    { provide: PasswordEncoder, useClass: BcryptPasswordEncoder },
    { provide: IdGenerator, useClass: NanoIdGenerator },
    { provide: Templating, useClass: TwigTemplating },
    StyleInliner,
  ],
  exports: [PasswordEncoder, IdGenerator, Templating, StyleInliner],
})
export class UtilsModule implements NestModule {
  public configure(consumer: MiddlewareConsumer) {
    // pass
  }
}
