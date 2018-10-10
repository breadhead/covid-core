import { Controller, Get, Query } from '@nestjs/common'
import { ApiOkResponse, ApiOperation, ApiUseTags } from '@nestjs/swagger'

import Historian from '@app/domain/service/Historian/Historian'

import ApiDateRangeQuery from '../request/dateRange/ApiDateRangeQuery'
import DateRandePipe from '../request/dateRange/DateRangePipe'
import DateRangeRequest from '../request/dateRange/DateRangeRequest'
import CompanyResponse from '../response/CompanyResponse'

@Controller('statistics')
@ApiUseTags('statistics')
export default class StatisticsController {
  public constructor(
    private readonly historian: Historian,
  ) {}

  @Get('donators')
  @ApiOperation({ title: 'List of donators by the period' })
  @ApiDateRangeQuery()
  @ApiOkResponse({ description: 'Success', type: CompanyResponse, isArray: true })
  public async showDonators(@Query(DateRandePipe) request: DateRangeRequest): Promise<CompanyResponse[]> {
    const donators = await this.historian.getDonators(request.from, request.to)

    return donators.map(CompanyResponse.fromDonator)
  }
}
