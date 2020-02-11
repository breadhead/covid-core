import { Controller, Get, Header, UseGuards, Inject } from '@nestjs/common'
import {
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiOperation,
  ApiUseTags,
} from '@nestjs/swagger'
import { Role } from '@app/user/model/Role'

import JwtAuthGuard from '../security/JwtAuthGuard'
import Roles from '../security/Roles'
import { AirBaseTable } from '@app/infrastructure/BaseTable/AirBaseTable'
import { BaseTable } from '@app/infrastructure/BaseTable/BaseTable'
import { InjectEntityManager } from '@nestjs/typeorm'
import { EntityManager } from 'typeorm'
import { BaseDoctorService } from '@app/domain/base-doctor/BaseDoctorService'

@Controller('base')
@UseGuards(JwtAuthGuard)
@ApiUseTags('base')
@ApiBearerAuth()
export default class BaseController {
  public constructor(
    @Inject(BaseTable)
    private readonly airtable: AirBaseTable,
    @Inject(BaseDoctorService)
    private readonly baseDoctor: BaseDoctorService,
  ) {}

  @Get('save-base-data')
  // @Header('Content-Type', 'application/json')
  @Roles(Role.Client, Role.CaseManager)
  @ApiOperation({ title: 'get base doctors' })
  @ApiOkResponse({ description: 'Success' })
  @ApiForbiddenResponse({
    description: 'Admin or Manager API token doesnt provided',
  })
  public async saveBaseData(): Promise<any> {
    const doctors = await this.airtable.load('Врачи')

    if (doctors) {
      this.baseDoctor.saveDoctors(doctors)
    }
  }
}
