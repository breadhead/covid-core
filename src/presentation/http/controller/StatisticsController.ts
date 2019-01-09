import { Controller, Get, Query, UseGuards } from '@nestjs/common'
import {
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiOperation,
  ApiUseTags,
} from '@nestjs/swagger'

import Historian from '@app/domain/service/Historian/Historian'
import Role from '@app/domain/user/Role'

import ApiDateRangeQuery from '../request/dateRange/ApiDateRangeQuery'
import DateRandePipe from '../request/dateRange/DateRangePipe'
import DateRangeRequest from '../request/dateRange/DateRangeRequest'
import CompanyResponse from '../response/CompanyResponse'
import JwtAuthGuard from '../security/JwtAuthGuard'
import Roles from '../security/Roles'

@Controller('statistics')
@UseGuards(JwtAuthGuard)
@ApiUseTags('statistics')
@ApiBearerAuth()
export default class StatisticsController {
  public constructor(private readonly historian: Historian) {}

  @Get('donators')
  @Roles(Role.Admin)
  @ApiOperation({ title: 'List of donators by the period' })
  @ApiDateRangeQuery()
  @ApiOkResponse({
    description: 'Success',
    type: CompanyResponse,
    isArray: true,
  })
  @ApiForbiddenResponse({ description: 'Admin API token doesn`t provided' })
  public async showDonators(
    @Query(DateRandePipe) request: DateRangeRequest,
  ): Promise<CompanyResponse[]> {
    const donators = await this.historian.getDonators(request.from, request.to)

    return donators.map(CompanyResponse.fromDonator)
  }
}
