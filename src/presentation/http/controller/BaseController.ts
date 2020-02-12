import { Controller, Get, Inject, Header, Headers } from '@nestjs/common'
import { ApiOkResponse, ApiOperation, ApiUseTags } from '@nestjs/swagger'

import { AirBaseTable } from '@app/infrastructure/BaseTable/AirBaseTable'
import { BaseTable } from '@app/infrastructure/BaseTable/BaseTable'

@Controller('base')
@ApiUseTags('base')
export default class BaseController {
  public constructor(
    @Inject(BaseTable)
    private readonly airtable: AirBaseTable,
  ) {}

  @Get('save-base-data')
  @Header('Content-Type', 'application/json')
  @ApiOperation({ title: 'get base doctors' })
  @ApiOkResponse({ description: 'Success' })
  public async saveBaseData(@Headers() headers) {
    return this.airtable.update(headers.authorization)
  }
}
