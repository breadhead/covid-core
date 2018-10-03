import { Body, Controller, Get, HttpCode, Post } from '@nestjs/common'
import {
  ApiBadRequestResponse, ApiCreatedResponse, ApiForbiddenResponse, ApiNotFoundResponse, ApiOkResponse,
  ApiOperation, ApiUseTags,
} from '@nestjs/swagger'
import { InjectRepository } from '@nestjs/typeorm'

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
  public transfer(@Body() transferRequest: QuotaTransferRequest): QuotaTransferResponse {
    return {
      source: {
        id: transferRequest.sourceId,
        name: 'Рак молочной железы, Кемеровская область',
        count: 12 - transferRequest.count,
      },
      target: {
        id: transferRequest.targetId,
        name: 'Общая квота',
        count: 10000 + transferRequest.count,
      },
    }
  }

  @Post('create')
  @ApiOperation({ title: 'Create the new quota' })
  @ApiCreatedResponse({ description: 'Created', type: QuotaResponse })
  @ApiBadRequestResponse({ description: 'Quota with the provided name already exists' })
  @ApiForbiddenResponse({ description: 'Admin API token doesn\'t provided' })
  public create(@Body() createRequest: QuotaCreateRequest): QuotaResponse {
    return {
      id: 'fdf',
      name: createRequest.name,
      count: createRequest.count,
    }
  }

  @Post('edit')
  @HttpCode(200)
  @ApiOperation({ title: 'Edit the existing quota'})
  @ApiOkResponse({ description: 'Success', type: QuotaResponse })
  @ApiNotFoundResponse({ description: 'Quota with the provided id doesn\'t exist' })
  @ApiForbiddenResponse({ description: 'Admin API token doesn\'t provided' })
  public edit(@Body() editRequest: QuotaEditRequest): QuotaResponse {
    return {
      id: editRequest.id,
      name: editRequest.name,
      count: editRequest.count,
    }
  }
}
