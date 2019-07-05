import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { DbOptionsFactory } from './DbOptionsFactory'
import { ConfigModule } from '@app/config/config.module'

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useClass: DbOptionsFactory,
    }),
  ],
  providers: [],
  exports: [],
})
export class DbModule implements NestModule {
  public configure(consumer: MiddlewareConsumer) {
    // pass
  }
}
