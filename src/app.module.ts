import { Module } from '@nestjs/common'
import { ModuleRef } from '@nestjs/core'
import { CQRSModule } from '@nestjs/cqrs'
import { TypeOrmModule } from '@nestjs/typeorm'

import ConfigModule from '@app/config.module'

import * as httpControllers from '@app/presentation/http/controller'
import EntityNotFoundFilter from '@app/presentation/http/filter/EntityNotFoundFilter'
import FilterProviderFactory from '@app/presentation/http/filter/FilterProviderFactory'
import InvariantViolationFilter from '@app/presentation/http/filter/InvariantViolationFilter'
import QueryFailedFilter from '@app/presentation/http/filter/QueryFailedFilter'

import PostMessageHandler from '@app/application/claim/PostMessageHandler'
import CreateQuotaHandler from '@app/application/quota/CreateQuotaHandler'
import RenameQuotaHandler from '@app/application/quota/RenameQuotaHandler'
import TransferQuotaHandler from '@app/application/quota/TransferQuotaHandler'

import Message from '@app/domain/claim/Message.entity'
import MessageRepository from '@app/domain/claim/MessageRepository'
import Company from '@app/domain/company/Company.entity'
import CompanyRepository from '@app/domain/company/CompanyRepository'
import Accountant from '@app/domain/quota/Accountant'
import Quota from '@app/domain/quota/Quota.entity'
import QuotaRepository from '@app/domain/quota/QuotaRepository'
import Historian from '@app/domain/service/Historian/Historian'

import CommandBus from '@app/infrastructure/CommandBus/CommandBus'
import DbConnectionFactory from '@app/infrastructure/DbConnection/DbConnectionFactory'
import { IdGenerator } from '@app/infrastructure/IdGenerator/IdGenerator'
import NanoIdGenerator from '@app/infrastructure/IdGenerator/NanoIdGenerator'

const commandHandlers = [
  CreateQuotaHandler, TransferQuotaHandler, RenameQuotaHandler,
  PostMessageHandler,
]

@Module({
  imports: [
    ConfigModule,
    CQRSModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useClass: DbConnectionFactory,
    }),
    TypeOrmModule.forFeature([Quota, QuotaRepository]),
    TypeOrmModule.forFeature([Company, CompanyRepository]),
    TypeOrmModule.forFeature([Message, MessageRepository]),
  ],
  controllers: [
    ...Object.values(httpControllers),
  ],
  providers: [
    ...FilterProviderFactory.providers(
      EntityNotFoundFilter,
      InvariantViolationFilter,
      QueryFailedFilter,
    ),
    ...commandHandlers,
    {
      provide: IdGenerator,
      useClass: NanoIdGenerator,
    },
    CommandBus,
    Accountant,
    Historian,
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
