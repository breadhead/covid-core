import BaseDoctor from '@app/domain/base-doctor/BaseDoctor.entity'
import { BaseDoctorRepository } from '@app/domain/base-doctor/BaseDoctorRepository'
import { AirBaseTable } from '@app/infrastructure/BaseTable/AirBaseTable'
import { BaseTable } from '@app/infrastructure/BaseTable/BaseTable'
import {
  Controller,
  Get,
  Inject,
  Header,
  Headers,
  Post,
  Query,
} from '@nestjs/common'
import {
  ApiOkResponse,
  ApiOperation,
  ApiUseTags,
  ApiImplicitQuery,
} from '@nestjs/swagger'
import { InjectRepository } from '@nestjs/typeorm'

@Controller('base')
@ApiUseTags('base')
export default class BaseController {
  public constructor(
    @Inject(BaseTable)
    private readonly airtable: AirBaseTable,
    @InjectRepository(BaseDoctorRepository)
    private readonly baseDoctorRepo: BaseDoctorRepository,
  ) {}

  @Get('doctors')
  @ApiOperation({ title: 'Search results' })
  @ApiImplicitQuery({ name: 'query', type: 'string', required: true })
  @ApiOkResponse({
    description: 'Success',
    type: 'SearchResponse',
    isArray: true,
  })
  public async getSearchData(@Query() query): Promise<BaseDoctor[]> {
    const items = await this.baseDoctorRepo.search(query.query)

    return items
  }

  @Post('save-base-data')
  @Header('Content-Type', 'application/json')
  @ApiOperation({ title: 'get base doctors' })
  @ApiOkResponse({ description: 'Success' })
  public async saveBaseData(@Headers() headers) {
    return this.airtable.update(headers.authorization)
  }
}
