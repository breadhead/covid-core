import { CommandBus } from '@breadhead/nest-throwable-bus'
import { Module } from '@nestjs/common'
import { ModuleRef } from '@nestjs/core'
import { CQRSModule } from '@nestjs/cqrs'
import { JwtModule } from '@nestjs/jwt'
import { PassportModule } from '@nestjs/passport'
import { TypeOrmModule } from '@nestjs/typeorm'

import ConfigModule from '@app/config.module'

import * as httpControllers from '@app/presentation/http/controller'
import httpFilters from '@app/presentation/http/filter'
import JwtAuthGuard from '@app/presentation/http/security/JwtAuthGuard'
import JwtStrategy from '@app/presentation/http/security/JwtStrategy'

import PostMessageHandler from '@app/application/claim/PostMessageHandler'
import CreateQuotaHandler from '@app/application/quota/CreateQuotaHandler'
import RenameQuotaHandler from '@app/application/quota/RenameQuotaHandler'
import TransferQuotaHandler from '@app/application/quota/TransferQuotaHandler'
import Authenticator from '@app/application/user/Authenticator'

import Claim from '@app/domain/claim/Claim.entity'
import ClaimRepository from '@app/domain/claim/ClaimRepository'
import Message from '@app/domain/claim/Message.entity'
import MessageRepository from '@app/domain/claim/MessageRepository'
import Company from '@app/domain/company/Company.entity'
import CompanyRepository from '@app/domain/company/CompanyRepository'
import Accountant from '@app/domain/quota/Accountant'
import Quota from '@app/domain/quota/Quota.entity'
import QuotaRepository from '@app/domain/quota/QuotaRepository'
import Historian from '@app/domain/service/Historian/Historian'
import User from '@app/domain/user/User.entity'
import UserRepository from '@app/domain/user/UserRepository'

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
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secretOrPrivateKey: 'secretKey',
      signOptions: {
        expiresIn: 3600,
      },
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useClass: DbConnectionFactory,
    }),
    TypeOrmModule.forFeature([Quota, QuotaRepository]),
    TypeOrmModule.forFeature([Company, CompanyRepository]),
    TypeOrmModule.forFeature([Message, MessageRepository]),
    TypeOrmModule.forFeature([Claim, ClaimRepository]),
    TypeOrmModule.forFeature([User, UserRepository]),
  ],
  controllers: [
    ...Object.values(httpControllers),
  ],
  providers: [
    ...httpFilters,
    ...commandHandlers,
    {
      provide: IdGenerator,
      useClass: NanoIdGenerator,
    },
    CommandBus,
    Accountant,
    Historian,
    Authenticator,
    JwtStrategy,
    JwtAuthGuard,
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
