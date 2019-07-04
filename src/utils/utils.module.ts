import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common'

import { PasswordEncoder } from './infrastructure/PasswordEncoder/PasswordEncoder'
import { BcryptPasswordEncoder } from './infrastructure/PasswordEncoder/BcryptPasswordEncoder'
import { IdGenerator } from './infrastructure/IdGenerator/IdGenerator'
import { NanoIdGenerator } from './infrastructure/IdGenerator/NanoIdGenerator'

@Module({
  providers: [
    { provide: PasswordEncoder, useClass: BcryptPasswordEncoder },
    { provide: IdGenerator, useClass: NanoIdGenerator },
  ],
  exports: [PasswordEncoder, IdGenerator],
})
export class UtilsModule implements NestModule {
  public configure(consumer: MiddlewareConsumer) {
    // pass
  }
}
