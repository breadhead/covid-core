import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common'

import { PasswordEncoder } from './infrastructure/PasswordEncoder/PasswordEncoder'
import { BcryptPasswordEncoder } from './infrastructure/PasswordEncoder/BcryptPasswordEncoder'
import { IdGenerator } from './infrastructure/IdGenerator/IdGenerator'
import { NanoIdGenerator } from './infrastructure/IdGenerator/NanoIdGenerator'
import { Templating } from './infrastructure/Templating/Templating'
import { TwigTemplating } from './infrastructure/Templating/TwigTemplating'
import { StyleInliner } from './infrastructure/Templating/processors/StyleInliner'
import { TableGenerator } from './infrastructure/TableGenerator/TableGenerator'
import { CsvTableGenerator } from './infrastructure/TableGenerator/CsvTableGenerator'
import { Logger } from './infrastructure/Logger/Logger'
import { ConsoleLogger } from './infrastructure/Logger/ConsoleLogger'

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
