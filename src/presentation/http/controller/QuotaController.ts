import { Controller, Get } from '@nestjs/common'
import { ApiForbiddenResponse, ApiOkResponse, ApiOperation, ApiUseTags } from '@nestjs/swagger'

import QuotaResponse from '../response/QuotaResponse'

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
}
