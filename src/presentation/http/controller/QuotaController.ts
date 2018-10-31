import { CommandBus } from '@breadhead/nest-throwable-bus'
import { Body, Controller, Get, HttpCode, Param, Post, Query, UseGuards } from '@nestjs/common'
import {
  ApiBadRequestResponse, ApiBearerAuth, ApiCreatedResponse,
  ApiForbiddenResponse, ApiNotFoundResponse, ApiOkResponse,
  ApiOperation, ApiUseTags,
} from '@nestjs/swagger'
import { InjectRepository } from '@nestjs/typeorm'

import CreateQuotaCommand from '@app/application/quota/CreateQuotaCommand'
import EditQuotaCommand from '@app/application/quota/EditQuotaCommand'
import TransferQuotaCommand from '@app/application/quota/TransferQuotaCommand'

import Quota from '@app/domain/quota/Quota.entity'
import QuotaRepository from '@app/domain/quota/QuotaRepository'
import Historian from '@app/domain/service/Historian/Historian'
import Role from '@app/domain/user/Role'

import IncomeQuotaCommand from '@app/application/quota/IncomeQuotaCommand'
import ApiDateRangeQuery from '../request/dateRange/ApiDateRangeQuery'
import DateRandePipe from '../request/dateRange/DateRangePipe'
import DateRangeRequest from '../request/dateRange/DateRangeRequest'
import QuotaCreateRequest from '../request/quota/QuotaCreateRequest'
import QuotaEditRequest from '../request/quota/QuotaEditRequest'
import QuotaIncomeRequest from '../request/quota/QuotaIncomeRequest'
import QuotaTransferRequest from '../request/quota/QuotaTransferRequest'
import QuotaResponse from '../response/QuotaResponse'
import QuotaTransferResponse from '../response/QuotaTransferResponse'
import TransactionRepsonse from '../response/TransactionResponse'
import JwtAuthGuard from '../security/JwtAuthGuard'
import Roles from '../security/Roles'

@Controller('quotas')
@UseGuards(JwtAuthGuard)
@ApiUseTags('quotas')
@ApiBearerAuth()
export default class QuotaController {

  public constructor(
    @InjectRepository(QuotaRepository) private readonly quotaRepo: QuotaRepository,
    private readonly historian: Historian,
    private readonly commandBus: CommandBus,
  ) { }

  @Get()
  @Roles(Role.CaseManager, Role.Admin)
  @ApiOperation({ title: 'List of quotas' })
  @ApiOkResponse({ description: 'Success', type: QuotaResponse, isArray: true })
  @ApiForbiddenResponse({ description: 'Case-manager or Admin API token doesn\'t provided' })
  public async showList(): Promise<QuotaResponse[]> {
    const quotas = await this.quotaRepo.findAll()

    return quotas.map(QuotaResponse.fromEntity)
  }

  @Get('history')
  @Roles(Role.Admin)
  @ApiOperation({ title: 'Transaction\'s history' })
  @ApiDateRangeQuery()
  @ApiOkResponse({ description: 'Success', type: TransactionRepsonse, isArray: true })
  @ApiForbiddenResponse({ description: 'Admin API token doesn\'t provided' })
  public async showTransactionHistory(@Query(DateRandePipe) request: DateRangeRequest): Promise<TransactionRepsonse[]> {
    const history = await this.historian.getHistory(request.from, request.to)

    return history.map(TransactionRepsonse.fromEntity)
  }

  @Get(':id')
  @Roles(Role.CaseManager, Role.Admin)
  @ApiOperation({ title: 'Quota' })
  @ApiOkResponse({ description: 'Success', type: QuotaResponse })
  @ApiForbiddenResponse({ description: 'Case-manager or Admin API token doesn\'t provided' })
  public async show(@Param('id') id: string): Promise<QuotaResponse> {
    const quota = await this.quotaRepo.getOne(id)

    return QuotaResponse.fromEntity(quota)
  }

  @Post('transfer')
  @HttpCode(200)
  @Roles(Role.Admin)
  @ApiOperation({ title: 'Transfer quota' })
  @ApiOkResponse({ description: 'Transfered', type: QuotaTransferResponse })
  @ApiNotFoundResponse({ description: 'Quota with the provided id doesn\'t exist' })
  @ApiForbiddenResponse({ description: 'Admin API token doesn\'t provided' })
  public async transfer(@Body() request: QuotaTransferRequest) {
    const [sourceQuota, targetQuota] = await this.commandBus.execute(
      new TransferQuotaCommand(request.sourceId, request.targetId, request.count),
    )

    return {
      source: QuotaResponse.fromEntity(sourceQuota),
      target: QuotaResponse.fromEntity(targetQuota),
    }
  }

  @Post('create')
  @Roles(Role.Admin)
  @ApiOperation({ title: 'Create the new quota' })
  @ApiCreatedResponse({ description: 'Created', type: QuotaResponse })
  @ApiBadRequestResponse({ description: 'Quota with the provided name already exists' })
  @ApiForbiddenResponse({ description: 'Admin API token doesn\'t provided' })
  public async create(@Body() request: QuotaCreateRequest): Promise<QuotaResponse> {
    const { count } = request
    const {
      name, constraints, corporate,
      companyName, companyLogoUrl, companyLink,
      publicCompany, comment,
    } = request.quota

    const quota: Quota = await this.commandBus.execute(
      new CreateQuotaCommand(
        name, count, constraints, corporate,
        companyName, companyLogoUrl, companyLink,
        publicCompany, comment,
      ),
    )

    return QuotaResponse.fromEntity(quota)
  }

  @Post('edit')
  @HttpCode(200)
  @Roles(Role.Admin)
  @ApiOperation({ title: 'Edit the existing quota' })
  @ApiOkResponse({ description: 'Success', type: QuotaResponse })
  @ApiNotFoundResponse({ description: 'Quota with the provided id doesn\'t exist' })
  @ApiForbiddenResponse({ description: 'Admin API token doesn\'t provided' })
  public async edit(@Body() request: QuotaEditRequest): Promise<QuotaResponse> {
    const { id } = request
    const {
      name, constraints, corporate,
      companyName, companyLogoUrl, companyLink,
      publicCompany, comment,
    } = request.quota

    const quota: Quota = await this.commandBus.execute(
      new EditQuotaCommand(
        id, name, constraints, corporate,
        companyName, companyLogoUrl, companyLink,
        publicCompany, comment,
      ),
    )

    return QuotaResponse.fromEntity(quota)
  }

  @Post('income')
  @HttpCode(200)
  @Roles(Role.Admin)
  @ApiOperation({ title: 'Increase balance of quota' })
  @ApiOkResponse({ description: 'Balance increased' })
  @ApiForbiddenResponse({ description: 'Admin API token doesn\'t provided' })
  @ApiNotFoundResponse({ description: 'Quota or company with the provided id doesn\'t exist' })
  public async income(@Body() request: QuotaIncomeRequest): Promise<QuotaResponse> {
    const command = new IncomeQuotaCommand(request.amount, request.quotaId)

    const quota: Quota = await this.commandBus.execute(command)

    return QuotaResponse.fromEntity(quota)
  }
}
