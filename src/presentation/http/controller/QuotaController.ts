import { Body, Controller, Get, HttpCode, Post } from '@nestjs/common'
import {
  ApiBadRequestResponse, ApiForbiddenResponse, ApiNotFoundResponse, ApiOkResponse,
  ApiOperation, ApiUseTags, ApiCreatedResponse,
} from '@nestjs/swagger'

import QuotaCreateRequest from '../request/QuotaCreateRequest'
import QuotaTransferRequest from '../request/QuotaTransferRequest'
import QuotaResponse from '../response/QuotaResponse'
import QuotaTransferResponse from '../response/QuotaTransferResponse'

@Controller('quotas')
@ApiUseTags('quotas')
export default class QuotaController {

  @Get()
  @ApiOperation({ title: 'List of quotas' })
  @ApiOkResponse({ description: 'Success', type: QuotaResponse, isArray: true })
  @ApiForbiddenResponse({ description: 'Case-manager or Admin API token doesn\'t provided' })
  public showList(): QuotaResponse[] {
    return [
      { id: 'jkhgd434kkkk', name: 'Общая квота', count: 10000 },
      { id: '123ffdsf4jhj', name: 'Рак молочной железы, Кемеровская область', count: 12 },
    ]
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
  @ApiOperation({ title: 'Create the new qouta' })
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
}
