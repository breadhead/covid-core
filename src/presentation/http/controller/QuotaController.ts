import { Body, Controller, Get, HttpCode, Post } from '@nestjs/common'
import { CommandBus } from '@nestjs/cqrs'
import {
  ApiBadRequestResponse, ApiCreatedResponse, ApiForbiddenResponse, ApiNotFoundResponse, ApiOkResponse,
  ApiOperation, ApiUseTags,
} from '@nestjs/swagger'
import { InjectRepository } from '@nestjs/typeorm'

import CreateQuotaCommand from '@app/application/quota/CreateQuotaCommand'

import Quota from '@app/domain/quota/Quota.entity'
import QuotaRepository from '@app/domain/quota/QuotaRepository'

import QuotaCreateRequest from '../request/QuotaCreateRequest'
import QuotaEditRequest from '../request/QuotaEditRequest'
import QuotaTransferRequest from '../request/QuotaTransferRequest'
import QuotaResponse from '../response/QuotaResponse'
import QuotaTransferResponse from '../response/QuotaTransferResponse'
@Controller('quotas')
@ApiUseTags('quotas')
export default class QuotaController {

  public constructor(
    @InjectRepository(QuotaRepository) private readonly quotaRepo: QuotaRepository,
    private readonly commandBus: CommandBus,
  ) {}

  @Get()
  @ApiOperation({ title: 'List of quotas' })
  @ApiOkResponse({ description: 'Success', type: QuotaResponse, isArray: true })
  @ApiForbiddenResponse({ description: 'Case-manager or Admin API token doesn\'t provided' })
  public async showList(): Promise<QuotaResponse[]> {
    const quotas = await this.quotaRepo.findAll()

    return quotas.map(QuotaResponse.fromEntity)
  }

  @Post('transfer')
  @HttpCode(200)
  @ApiOperation({ title: 'Transfer quota' })
  @ApiOkResponse({ description: 'Transfered', type: QuotaTransferResponse })
  @ApiNotFoundResponse({ description: 'Quota with the provided id doesn\'t exist' })
  @ApiForbiddenResponse({ description: 'Admin API token doesn\'t provided' })
  public async transfer(@Body() transferRequest: QuotaTransferRequest): Promise<QuotaTransferResponse> {
    const [ sourceQuota, targetQuota ] = await Promise.all([
      this.quotaRepo.getOne(transferRequest.sourceId),
      this.quotaRepo.getOne(transferRequest.targetId),
    ])

    return {
      source: {
        id: sourceQuota.id,
        name: sourceQuota.name,
        count: sourceQuota.balance - transferRequest.count,
      },
      target: {
        id: targetQuota.id,
        name: targetQuota.name,
        count: targetQuota.balance + transferRequest.count,
      },
    }
  }

  @Post('create')
  @ApiOperation({ title: 'Create the new quota' })
  @ApiCreatedResponse({ description: 'Created', type: QuotaResponse })
  @ApiBadRequestResponse({ description: 'Quota with the provided name already exists' })
  @ApiForbiddenResponse({ description: 'Admin API token doesn\'t provided' })
  public async create(@Body() request: QuotaCreateRequest): Promise<QuotaResponse> {
    const quota: Quota = await this.commandBus.execute(
      new CreateQuotaCommand(request.name, request.count),
    )

    return QuotaResponse.fromEntity(quota)
  }

  @Post('edit')
  @HttpCode(200)
  @ApiOperation({ title: 'Edit the existing quota'})
  @ApiOkResponse({ description: 'Success', type: QuotaResponse })
  @ApiNotFoundResponse({ description: 'Quota with the provided id doesn\'t exist' })
  @ApiForbiddenResponse({ description: 'Admin API token doesn\'t provided' })
  public async edit(@Body() editRequest: QuotaEditRequest): Promise<QuotaResponse> {
    const quota = await this.quotaRepo.getOne(editRequest.id)

    return {
      id: quota.id,
      name: editRequest.name,
      count: editRequest.count,
    }
  }
}
