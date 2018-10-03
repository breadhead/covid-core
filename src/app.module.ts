import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import ConfigModule from '@app/config.module'
import Quota from '@app/domain/quota/Quota.entity'
import QuotaRepository from '@app/domain/quota/QuotaRepository'
import DbConnectionFactory from '@app/infrastructure/DbConnection/DbConnectionFactory'
import * as httpControllers from '@app/presentation/http/controller'

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useClass: DbConnectionFactory,
    }),
    TypeOrmModule.forFeature([Quota, QuotaRepository]),
  ],
  controllers: [
    ...Object.values(httpControllers),
  ],
  providers: [],
})
export class AppModule {}
