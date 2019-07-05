import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common'

import { PasswordEncoder } from './service/PasswordEncoder/PasswordEncoder'
import { BcryptPasswordEncoder } from './service/PasswordEncoder/BcryptPasswordEncoder'
import { IdGenerator } from './service/IdGenerator/IdGenerator'
import { NanoIdGenerator } from './service/IdGenerator/NanoIdGenerator'
import { Templating } from './service/Templating/Templating'
import { TwigTemplating } from './service/Templating/TwigTemplating'
import { StyleInliner } from './service/Templating/processors/StyleInliner'
import { TableGenerator } from './service/TableGenerator/TableGenerator'
import { CsvTableGenerator } from './service/TableGenerator/CsvTableGenerator'
import { Logger } from './service/Logger/Logger'
import { ConsoleLogger } from './service/Logger/ConsoleLogger'

@Module({
  providers: [
    { provide: Logger, useClass: ConsoleLogger },
    { provide: TableGenerator, useClass: CsvTableGenerator },
    { provide: PasswordEncoder, useClass: BcryptPasswordEncoder },
    { provide: IdGenerator, useClass: NanoIdGenerator },
    { provide: Templating, useClass: TwigTemplating },
    StyleInliner,
  ],
  exports: [
    PasswordEncoder,
    IdGenerator,
    Templating,
    StyleInliner,
    TableGenerator,
    Logger,
  ],
})
export class UtilsModule implements NestModule {
  public configure(consumer: MiddlewareConsumer) {
    // pass
  }
}
