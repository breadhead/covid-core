import { CommandBus } from '@breadhead/nest-throwable-bus'
import {
  HttpModule,
  Inject,
  MiddlewareConsumer,
  Module,
  NestModule,
} from '@nestjs/common'
import { APP_INTERCEPTOR, ModuleRef } from '@nestjs/core'
import { CQRSModule } from '@nestjs/cqrs'
import { JwtModule } from '@nestjs/jwt'
import { PassportModule } from '@nestjs/passport'
import { TypeOrmModule } from '@nestjs/typeorm'

import { ConfigModule } from '@app/config/config.module'

import DoctorCommand from '@app/presentation/cli/command/DoctorCommand'
import CommandRunner from '@app/presentation/cli/CommandRunner'
import * as httpControllers from '@app/presentation/http/controller'
import httpFilters from '@app/presentation/http/filter'
import LoggerInterseptor from '@app/presentation/http/logging/LoggerInterseptor'
import JwtAuthGuard from '@app/presentation/http/security/JwtAuthGuard'
import JwtStrategy from '@app/presentation/http/security/JwtStrategy'

import { NotifyMessageRecurrenter } from '@app/application/claim/chat/NotifyMessageRecurrenter'
import PostMessageHandler from '@app/application/claim/chat/PostMessageHandler'
import PostMessageVoter from '@app/application/claim/chat/PostMessageVoter'
import ChooseDoctorHandler from '@app/application/claim/ChooseDoctorHandler'
import CloseClaimHandler from '@app/application/claim/CloseClaimHandler'
import { CorporateStatusMover } from '@app/application/claim/corporate/CorporateStatusMover'
import EditClaimVoter from '@app/application/claim/EditClaimVoter'
import MoveToNextStatusHandler from '@app/application/claim/MoveToNextStatusHandler'
import AnswerAccessManager from '@app/application/claim/questions/AnswerAccessManager'
import { AnsweringQuestions } from '@app/application/claim/questions/AnsweringQuestions'
import AskQuestionsHandler from '@app/application/claim/questions/AskQuestionsHandler'
import CreateClaimHandler from '@app/application/claim/short/CreateClaimHandler'
import EditShortClaimHandler from '@app/application/claim/short/EditShortClaimHandler'
import ShowClaimVoter from '@app/application/claim/ShowClaimVoter'
import EditSituationHandler from '@app/application/claim/situation/EditSituationHandler'
import CreateDraftHandler from '@app/application/draft/CreateDraftHandler'
import DraftVoter from '@app/application/draft/DraftVoter'
import EditDraftHandler from '@app/application/draft/EditDraftHandler'
import PostFeedbackHandler from '@app/application/feedback/PostFeedbackHandler'
import AllNotificator from '@app/application/notifications/AllNotificator'
import EmailNotificator from '@app/application/notifications/EmailNotificator'
import { Notificator } from '@app/application/notifications/Notificator'
import SmsNotificator from '@app/application/notifications/SmsNotificator'
import BindQuotaHandler from '@app/application/quota/BindQuotaHandler'
import CreateQuotaHandler from '@app/application/quota/CreateQuotaHandler'
import EditQuotaHandler from '@app/application/quota/EditQuotaHandler'
import IncomeQuotaHandler from '@app/application/quota/IncomeQuotaHandler'
import TransferQuotaHandler from '@app/application/quota/TransferQuotaHandler'
import BoardSubscriber from '@app/application/subscriber/BoardSubscriber'
import NotifySubscriber from '@app/application/subscriber/NotifySubscriber'
import Authenticator from '@app/application/user/auth/Authenticator'
import InternalSignInProvider from '@app/application/user/auth/providers/InternalSignInProvider'
import NenaprasnoCabinetSignInProvider from '@app/application/user/auth/providers/NenaprasnoCabinetSignInProvider'
import SignInProvider, {
  SignInProviders,
} from '@app/application/user/auth/providers/SignInProvider'
import CreateUserFromCabinetHandler from '@app/application/user/createUser/CreateUserFromCabinetHandler'
import SendVerificationHandler from '@app/application/user/verification/SendVerificationHandler'
import VerificateHandler from '@app/application/user/verification/VerificateHandler'
import { DoctorManager } from '@app/application/user/createUser/DoctorManager'
import { AuditorDoctors } from '@app/application/statistic/AuditorDoctors'

import Claim from '@app/domain/claim/Claim.entity'
import ClaimBoardCardFinder from '@app/domain/claim/ClaimBoardCardFinder'
import { ClaimRepository } from '@app/domain/claim/ClaimRepository'
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
import { FeedbackAnswerRecurrenter } from '@app/domain/service/FeedbackAnswerRecurrenter'

import { BoardManager } from '@app/infrastructure/BoardManager/BoardManager'
import TrelloBoardManager from '@app/infrastructure/BoardManager/TrelloBoardManager'
import EventEmitter from '@app/infrastructure/events/EventEmitter'
import { FileSaver } from '@app/infrastructure/FileSaver/FileSaver'
import { S3FileSaver } from '@app/infrastructure/FileSaver/S3FileSaver'
import JwtOptionsFactory from '@app/infrastructure/JwtOptionsFactory'
import NenaprasnoBackendClient from '@app/infrastructure/Nenaprasno/NenaprasnoBackendClient'
import SecurityVotersUnity from '@app/infrastructure/security/SecurityVoter/SecurityVotersUnity'

import { UtilsModule } from './utils/utils.module'
import { SenderModule } from './sender/sender.module'
import { UserModule } from './user/user.module'
import { DbModule } from './db/db.module'

const cliCommands = [DoctorCommand]

const commandHandlers = [
  AskQuestionsHandler,
  CreateQuotaHandler,
  TransferQuotaHandler,
  EditQuotaHandler,
  BindQuotaHandler,
  PostMessageHandler,
  CreateUserFromCabinetHandler,
  SendVerificationHandler,
  PostFeedbackHandler,
  CreateClaimHandler,
  CloseClaimHandler,
  CreateDraftHandler,
  EditDraftHandler,
  MoveToNextStatusHandler,
  IncomeQuotaHandler,
  EditSituationHandler,
  EditShortClaimHandler,
  ChooseDoctorHandler,
  VerificateHandler,
]

const signInProviders = [
  InternalSignInProvider,
  NenaprasnoCabinetSignInProvider,
]

const securityVoters = [
  PostMessageVoter,
  DraftVoter,
  ShowClaimVoter,
  EditClaimVoter,
]

const notificators = [SmsNotificator, EmailNotificator]

const eventSubscribers = [BoardSubscriber, NotifySubscriber]

@Module({
  imports: [
    UtilsModule,
    ConfigModule,
    DbModule,
    SenderModule,
    UserModule,
    CQRSModule,
    PassportModule.register({
      defaultStrategy: 'jwt',
    }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useClass: JwtOptionsFactory,
    }),
    TypeOrmModule.forFeature([
      Quota,
      QuotaRepository,
      Company,
      CompanyRepository,
      Message,
      MessageRepository,
      Claim,
      Draft,
      DraftRepository,
    ]),
    HttpModule,
  ],
  controllers: [...Object.values(httpControllers)],
  providers: [
    ...cliCommands,
    ...httpFilters,
    ...commandHandlers,
    ...securityVoters,
    ...eventSubscribers,
    ...signInProviders,
    ...notificators,
    ClaimBoardCardFinder,
    DoctorManager,
    {
      provide: SignInProviders,
      useFactory: (...providers: SignInProvider[]) => providers,
      inject: signInProviders,
    },
    {
      provide: Notificator,
      useClass: AllNotificator,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggerInterseptor,
    },
    {
      provide: FileSaver,
      useClass: S3FileSaver,
    },
    {
      provide: BoardManager,
      useClass: TrelloBoardManager,
    },
    CorporateStatusMover,
    AnsweringQuestions,
    AnswerAccessManager,
    CommandBus,
    StatusMover,
    NotifyMessageRecurrenter,
    FeedbackAnswerRecurrenter,
    Allocator,
    Accountant,
    Historian,
    Authenticator,
    JwtStrategy,
    JwtAuthGuard,
    SecurityVotersUnity,
    NenaprasnoBackendClient,
    EventEmitter,
    CommandRunner,
    ClaimRepository,
    AuditorDoctors,
  ],
})
export class AppModule implements NestModule {
  public constructor(
    private readonly moduleRef: ModuleRef,
    private readonly command$: CommandBus,
    private readonly votersUnity: SecurityVotersUnity,
    private readonly commandRunner: CommandRunner,
    private readonly eventEmitter: EventEmitter,
    @Inject(Notificator) private readonly allNotificator: AllNotificator,
    private readonly notifyMessageRecurrenter: NotifyMessageRecurrenter,
    private readonly feedbackAnswerRecurrenter: FeedbackAnswerRecurrenter,
  ) {}

  public onModuleInit() {
    this.command$.setModuleRef(this.moduleRef)
    this.command$.register(commandHandlers)

    this.votersUnity.setModuleRef(this.moduleRef)
    this.votersUnity.register(securityVoters)

    this.eventEmitter.setModuleRef(this.moduleRef)
    this.eventEmitter.register(eventSubscribers)

    this.commandRunner.setModuleRef(this.moduleRef)
    this.commandRunner.register(cliCommands)

    this.allNotificator.setModuleRef(this.moduleRef)
    this.allNotificator.register(notificators)

    this.notifyMessageRecurrenter.start()
    this.feedbackAnswerRecurrenter.start()
  }

  public configure(consumer: MiddlewareConsumer) {
    // pass
  }
}
