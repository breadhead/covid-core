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
import BaseDoctor from '@app/domain/base-doctor/BaseDoctor.entity'
import { InjectEntityManager } from '@nestjs/typeorm'
import { EntityManager } from 'typeorm'

@Controller('base')
@UseGuards(JwtAuthGuard)
@ApiUseTags('base')
@ApiBearerAuth()
export default class BaseController {
  public constructor(
    @Inject(BaseTable)
    private readonly airtable: AirBaseTable,
    @InjectEntityManager() private readonly em: EntityManager,
  ) {}

  @Get('doctors')
  // @Header('Content-Type', 'application/json')
  @Roles(Role.Client, Role.CaseManager)
  @ApiOperation({ title: 'get base doctors' })
  @ApiOkResponse({ description: 'Success' })
  @ApiForbiddenResponse({
    description: 'Admin or Manager API token doesnt provided',
  })
  public async getBaseDoctors(): Promise<any> {
    const baseDoctors = await this.airtable
      .load('Врачи')
      .catch(err => console.log('airtable error', err))

    const doctors =
      baseDoctors &&
      baseDoctors.map(doctor =>
        this.em.save(
          new BaseDoctor(doctor.id, doctor._rawJson.fields['Имя'].trim()),
        ),
      )

    await Promise.all(doctors)

    return baseDoctors
  }
}
