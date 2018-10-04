import { Module } from '@nestjs/common'
import { ModuleRef } from '@nestjs/core'
import { CommandBus, CQRSModule } from '@nestjs/cqrs'
import { TypeOrmModule } from '@nestjs/typeorm'

import ConfigModule from '@app/config.module'

import * as httpControllers from '@app/presentation/http/controller'
import EntityNotFoundFilter from '@app/presentation/http/filter/EntityNotFoundFilter'
import FilterProviderFactory from '@app/presentation/http/filter/FilterProviderFactory'

import CreateQuotaHandler from '@app/application/quota/CreateQuotaHandler'

import Quota from '@app/domain/quota/Quota.entity'
import QuotaRepository from '@app/domain/quota/QuotaRepository'

import DbConnectionFactory from '@app/infrastructure/DbConnection/DbConnectionFactory'
import { IdGenerator } from '@app/infrastructure/IdGenerator/IdGenerator'
import NanoIdGenerator from '@app/infrastructure/IdGenerator/NanoIdGenerator'

const commandHandlers = [CreateQuotaHandler]

@Module({
  imports: [
    ConfigModule,
    CQRSModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useClass: DbConnectionFactory,
    }),
    TypeOrmModule.forFeature([Quota, QuotaRepository]),
  ],
  controllers: [
    ...Object.values(httpControllers),
  ],
  providers: [
    ...FilterProviderFactory.providers(
      EntityNotFoundFilter,
    ),
    ...commandHandlers,
    {
      provide: IdGenerator,
      useClass: NanoIdGenerator,
    },
  ],
})
export class AppModule {
  public constructor(
    private readonly moduleRef: ModuleRef,
    private readonly command$: CommandBus,
  ) {}

  public onModuleInit() {
    this.command$.setModuleRef(this.moduleRef)
    this.command$.register(commandHandlers)
  }
}
