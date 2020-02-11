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

import { BaseDoctorService } from '@app/domain/base-doctor/BaseDoctorService'
import { BaseTabeViewEnum } from '@app/infrastructure/BaseTable/BaseTabeViewEnum'
import { BaseClinicService } from '@app/domain/base-clinic/BaseClinicService'

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
    @Inject(BaseClinicService)
    private readonly baseClinic: BaseClinicService,
  ) {}

  @Get('save-base-data')
  // @Header('Content-Type', 'application/json')
  @Roles(Role.Client, Role.CaseManager)
  @ApiOperation({ title: 'get base doctors' })
  @ApiOkResponse({ description: 'Success' })
  @ApiForbiddenResponse({
    description: 'Admin or Manager API token doesnt provided',
  })
  public async saveBaseData() {
    const doctors = await this.airtable.load('Врачи', BaseTabeViewEnum.Grid)
    const clinics = await this.airtable.load(
      'Учреждения',
      BaseTabeViewEnum.Table,
    )

    if (doctors) {
      this.baseDoctor.save(doctors)
    }

    if (clinics) {
      this.baseClinic.save(clinics)
    }
  }
}
