import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import ConfigModule from '@app/config.module'
import DbConnectionFactory from '@app/infrastructure/DbConnection/DbConnectionFactory'
import * as httpControllers from '@app/presentation/http/controller'

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useClass: DbConnectionFactory,
    }),
  ],
  controllers: [
    ...Object.values(httpControllers),
  ],
  providers: [],
})
export class AppModule {}
