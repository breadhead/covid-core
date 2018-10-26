import { CommandBus } from '@breadhead/nest-throwable-bus'
import { HttpModule, MiddlewareConsumer, Module, NestModule } from '@nestjs/common'
import { APP_INTERCEPTOR, ModuleRef } from '@nestjs/core'
import { CQRSModule } from '@nestjs/cqrs'
import { JwtModule } from '@nestjs/jwt'
import { PassportModule } from '@nestjs/passport'
import { TypeOrmModule } from '@nestjs/typeorm'

import ConfigModule from '@app/config.module'

import * as httpControllers from '@app/presentation/http/controller'
import httpFilters from '@app/presentation/http/filter'
import LoggerInterseptor from '@app/presentation/http/logging/LoggerInterseptor'
import JwtAuthGuard from '@app/presentation/http/security/JwtAuthGuard'
import JwtStrategy from '@app/presentation/http/security/JwtStrategy'

import PostMessageHandler from '@app/application/claim/chat/PostMessageHandler'
import PostMessageVoter from '@app/application/claim/chat/PostMessageVoter'
import ShowChatVoter from '@app/application/claim/chat/ShowChatVoter'
import CloseClaimHandler from '@app/application/claim/CloseClaimHandler'
import CreateClaimHandler from '@app/application/claim/CreateClaimHandler'
import MoveToNextStatusHandler from '@app/application/claim/MoveToNextStatusHandler'
import ShowClaimVoter from '@app/application/claim/ShowClaimVoter'
import CreateDraftHandler from '@app/application/draft/CreateDraftHandler'
import DraftVoter from '@app/application/draft/DraftVoter'
import EditDraftHandler from '@app/application/draft/EditDraftHandler'
import PostFeedbackHandler from '@app/application/feedback/PostFeedbackHandler'
import EmailNotificator from '@app/application/notifications/EmailNotificator'
import { Notificator } from '@app/application/notifications/Notificator'
import BindQuotaHandler from '@app/application/quota/BindQuotaHandler'
import CreateQuotaHandler from '@app/application/quota/CreateQuotaHandler'
import EditQuotaHandler from '@app/application/quota/EditQuotaHandler'
import TransferQuotaHandler from '@app/application/quota/TransferQuotaHandler'
import BoardSubscriber from '@app/application/subscriber/BoardSubscriber'
import NotifySubscriber from '@app/application/subscriber/NotifySubscriber'
import Authenticator from '@app/application/user/auth/Authenticator'
import InternalSignInProvider from '@app/application/user/auth/providers/InternalSignInProvider'
import NenaprasnoCabinetSignInProvider from '@app/application/user/auth/providers/NenaprasnoCabinetSignInProvider'
import SignInProvider, { SignInProviders } from '@app/application/user/auth/providers/SignInProvider'
import CreateUserFromCabinetHandler from '@app/application/user/createUser/CreateUserFromCabinetHandler'
import SendVerificationHandler from '@app/application/user/verification/SendVerificationHandler'

import Claim from '@app/domain/claim/Claim.entity'
import ClaimRepository from '@app/domain/claim/ClaimRepository'
import Message from '@app/domain/claim/Message.entity'
import MessageRepository from '@app/domain/claim/MessageRepository'
import StatusMover from '@app/domain/claim/StatusMover'
import Company from '@app/domain/company/Company.entity'
import CompanyRepository from '@app/domain/company/CompanyRepository'
import Draft from '@app/domain/draft/Draft.entity'
import DraftRepository from '@app/domain/draft/DraftRepository'
import Accountant from '@app/domain/quota/Accountant'
import Allocator from '@app/domain/quota/Allocator'
import Quota from '@app/domain/quota/Quota.entity'
import QuotaRepository from '@app/domain/quota/QuotaRepository'
import Historian from '@app/domain/service/Historian/Historian'
import User from '@app/domain/user/User.entity'
import UserRepository from '@app/domain/user/UserRepository'

import { BoardManager } from '@app/infrastructure/BoardManager/BoardManager'
import VoidBoardManager from '@app/infrastructure/BoardManager/VoidBoardManager'
import DbOptionsFactory from '@app/infrastructure/DbOptionsFactory'
import { EmailSender } from '@app/infrastructure/EmailSender/EmailSender'
import NodemailerEmailSender from '@app/infrastructure/EmailSender/NodemailerEmailSender'
import EventEmitter from '@app/infrastructure/events/EventEmitter'
import { FileSaver } from '@app/infrastructure/FileSaver/FileSaver'
import LocalFileSaver from '@app/infrastructure/FileSaver/LocalFileSaver'
import { IdGenerator } from '@app/infrastructure/IdGenerator/IdGenerator'
import NanoIdGenerator from '@app/infrastructure/IdGenerator/NanoIdGenerator'
import JwtOptionsFactory from '@app/infrastructure/JwtOptionsFactory'
import ConsoleLogger from '@app/infrastructure/Logger/ConsoleLogger'
import Logger from '@app/infrastructure/Logger/Logger'
import { Monitor } from '@app/infrastructure/Logger/Monitor/Monitor'
import VoidMonitor from '@app/infrastructure/Logger/Monitor/VoidMonitor'
import NenaprasnoCabinetClient from '@app/infrastructure/Nenaprasno/NenaprasnoCabinetClient'
import BcryptPasswordEncoder from '@app/infrastructure/PasswordEncoder/BcryptPasswordEncoder'
import { PasswordEncoder } from '@app/infrastructure/PasswordEncoder/PasswordEncoder'
import SecurityVotersUnity from '@app/infrastructure/security/SecurityVoter/SecurityVotersUnity'
import RedSmsSender from '@app/infrastructure/SmsSender/RedSmsSender'
import { SmsSender } from '@app/infrastructure/SmsSender/SmsSender'
import { TemplateEngine } from '@app/infrastructure/TemplateEngine/TemplateEngine'
import TwigTemplateEngine from '@app/infrastructure/TemplateEngine/TwigTemplateEngine'
import IncomeQuotaHandler from './application/quota/IncomeQuotaHandler'

const commandHandlers = [
  CreateQuotaHandler, TransferQuotaHandler, EditQuotaHandler, BindQuotaHandler,
  PostMessageHandler,
  CreateUserFromCabinetHandler, SendVerificationHandler,
  PostFeedbackHandler,
  CreateClaimHandler, CloseClaimHandler,
  CreateDraftHandler, EditDraftHandler,
  MoveToNextStatusHandler,
  IncomeQuotaHandler,
]

const signInProviders = [
  InternalSignInProvider,
  NenaprasnoCabinetSignInProvider,
]

const securityVoters = [
  PostMessageVoter,
  DraftVoter,
  ShowClaimVoter, ShowChatVoter,
]

const eventSubscribers = [
  BoardSubscriber,
  NotifySubscriber,
]

@Module({
  imports: [
    ConfigModule,
    CQRSModule,
    PassportModule.register({
      defaultStrategy: 'jwt',
    }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useClass: JwtOptionsFactory,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useClass: DbOptionsFactory,
    }),
    TypeOrmModule.forFeature([
      Quota, QuotaRepository,
      Company, CompanyRepository,
      Message, MessageRepository,
      Claim, ClaimRepository,
      User, UserRepository,
      Draft, DraftRepository,
    ]),
    HttpModule,
  ],
  controllers: [
    ...Object.values(httpControllers),
  ],
  providers: [
    ...httpFilters,
    ...commandHandlers,
    ...securityVoters,
    ...eventSubscribers,
    ...signInProviders,
    {
      provide: SignInProviders,
      useFactory: (...providers: SignInProvider[]) => providers,
      inject: signInProviders,
    },
    {
      provide: IdGenerator,
      useClass: NanoIdGenerator,
    },
    {
      provide: PasswordEncoder,
      useClass: BcryptPasswordEncoder,
    },
    {
      provide: Notificator,
      useClass: EmailNotificator,
    },
    {
      provide: EmailSender,
      useClass: NodemailerEmailSender,
    },
    {
      provide: SmsSender,
      useClass: RedSmsSender,
    },
    {
      provide: TemplateEngine,
      useClass: TwigTemplateEngine,
    },
    {
      provide: Logger,
      useClass: ConsoleLogger,
    },
    {
      provide: Monitor,
      useClass: VoidMonitor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggerInterseptor,
    },
    {
      provide: FileSaver,
      useClass: LocalFileSaver,
    },
    {
      provide: BoardManager,
      useClass: VoidBoardManager,
    },
    CommandBus,
    StatusMover,
    Allocator,
    Accountant,
    Historian,
    Authenticator,
    JwtStrategy,
    JwtAuthGuard,
    SecurityVotersUnity,
    NenaprasnoCabinetClient,
    EventEmitter,
  ],
})
export class AppModule implements NestModule {
  public constructor(
    private readonly moduleRef: ModuleRef,
    private readonly command$: CommandBus,
    private readonly votersUnity: SecurityVotersUnity,
    private readonly eventEmitter: EventEmitter,
  ) { }

  public onModuleInit() {
    this.command$.setModuleRef(this.moduleRef)
    this.command$.register(commandHandlers)

    this.votersUnity.setModuleRef(this.moduleRef)
    this.votersUnity.register(securityVoters)

    this.eventEmitter.setModuleRef(this.moduleRef)
    this.eventEmitter.register(eventSubscribers)
  }

  public configure(consumer: MiddlewareConsumer) {
    // pass
  }
}
