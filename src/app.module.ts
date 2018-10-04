import { Module } from '@nestjs/common'
import { ModuleRef } from '@nestjs/core'
import { CQRSModule } from '@nestjs/cqrs'
import { TypeOrmModule } from '@nestjs/typeorm'

import ConfigModule from '@app/config.module'

import * as httpControllers from '@app/presentation/http/controller'
import EntityNotFoundFilter from '@app/presentation/http/filter/EntityNotFoundFilter'
import FilterProviderFactory from '@app/presentation/http/filter/FilterProviderFactory'
import InvariantViolationFilter from '@app/presentation/http/filter/InvariantViolationFilter'

import CreateQuotaHandler from '@app/application/quota/CreateQuotaHandler'
import RenameQuotaHandler from '@app/application/quota/RenameQuotaHandler'
import TransferQuotaHandler from '@app/application/quota/TransferQuotaHandler'

import Quota from '@app/domain/quota/Quota.entity'
import QuotaRepository from '@app/domain/quota/QuotaRepository'

import CommandBus from '@app/infrastructure/CommandBus/CommandBus'
import DbConnectionFactory from '@app/infrastructure/DbConnection/DbConnectionFactory'
import { IdGenerator } from '@app/infrastructure/IdGenerator/IdGenerator'
import NanoIdGenerator from '@app/infrastructure/IdGenerator/NanoIdGenerator'

const commandHandlers = [CreateQuotaHandler, TransferQuotaHandler, RenameQuotaHandler]

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
      InvariantViolationFilter,
    ),
    ...commandHandlers,
    {
      provide: IdGenerator,
      useClass: NanoIdGenerator,
    },
    CommandBus,
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
