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
  ApiNotFoundResponse,
} from '@nestjs/swagger'
import { InjectRepository } from '@nestjs/typeorm'
import { BaseClinicRepository } from '@app/domain/base-clinic/BaseClinicRepository'
import ClinicsByRegionRequest from '../request/ClinicsByRegionRequest'
import { BaseClinicService } from '@app/domain/base-clinic/BaseClinicService'
import ClinicsByRegionResponse from '../response/ClinicsByRegionResponse'

@Controller('base')
@ApiUseTags('base')
export default class BaseController {
  public constructor(
    @Inject(BaseTable)
    private readonly airtable: AirBaseTable,
    @InjectRepository(BaseDoctorRepository)
    private readonly baseDoctorRepo: BaseDoctorRepository,
    @InjectRepository(BaseClinicRepository)
    private readonly baseClinicRepo: BaseClinicRepository,
    @Inject(BaseClinicService)
    private readonly clinicService: BaseClinicService,
  ) {}

  @Get('doctors')
  @ApiOperation({ title: 'Search results' })
  @ApiImplicitQuery({ name: 'query', type: 'string', required: true })
  @ApiOkResponse({ description: 'Success' })
  @ApiNotFoundResponse({ description: 'doctor not found' })
  public async getSearchDoctors(@Query() query): Promise<string[]> {
    const items = await this.baseDoctorRepo.search(query.query)

    const names = items.map(it => it.name)
    const unique = Array.from(new Set(names))

    return unique
  }

  @Get('clinics')
  @ApiOperation({ title: 'Search results' })
  @ApiImplicitQuery({ name: 'query', type: 'string', required: true })
  @ApiOkResponse({ description: 'Success' })
  @ApiNotFoundResponse({ description: 'clinics not found' })
  public async getSearchClinics(@Query() query): Promise<string[]> {
    const items = await this.baseClinicRepo.searchByName(query.query)

    const names = items.map(it => it.name)
    const unique = Array.from(new Set(names))

    return unique
  }

  @Get('clinics-by-region')
  @ApiOperation({ title: 'Search results' })
  @ApiImplicitQuery({ name: 'region', type: 'string', required: true })
  @ApiOkResponse({ description: 'Success' })
  @ApiNotFoundResponse({ description: 'clinics not found' })
  public async getSearchClinicsByRegion(
    @Query() query: ClinicsByRegionRequest,
  ): Promise<ClinicsByRegionResponse[]> {
    const { region, name } = query

    return this.clinicService.getClinicsByRegion(region, name)
  }

  @Post('save-base-data')
  @Header('Content-Type', 'application/json')
  @ApiOperation({ title: 'get base doctors' })
  @ApiOkResponse({ description: 'Success' })
  public async saveBaseData(@Headers() headers) {
    return this.airtable.update(headers.authorization)
  }
}
