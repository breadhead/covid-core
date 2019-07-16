import { Controller, Get, Header, Query, UseGuards } from '@nestjs/common'
import {
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiOperation,
  ApiUseTags,
} from '@nestjs/swagger'
import { InjectRepository } from '@nestjs/typeorm'

import { ClaimRepository } from '@app/domain/claim/ClaimRepository'
import QuotaRepository from '@app/domain/quota/QuotaRepository'
import Historian from '@app/domain/service/Historian/Historian'
import { Role } from '@app/user/model/Role'
import { Configuration } from '@app/config/Configuration'
import { AuditorDoctors } from '@app/application/statistic/AuditorDoctors'

import ApiDateRangeQuery from '../request/dateRange/ApiDateRangeQuery'
import DateRandePipe from '../request/dateRange/DateRangePipe'
import DateRangeRequest from '../request/dateRange/DateRangeRequest'
import { ClaimStatisticsItem } from '../response/ClaimStatisticsItem'
import CompanyResponse from '../response/CompanyResponse'
import JwtAuthGuard from '../security/JwtAuthGuard'
import Roles from '../security/Roles'
import { DoctorAnswerTimeResponse } from '../response/DoctorAnswerTimeResponse'
import { TableGenerator } from '@app/utils/service/TableGenerator/TableGenerator'

@Controller('statistics')
@UseGuards(JwtAuthGuard)
@ApiUseTags('statistics')
@ApiBearerAuth()
export default class StatisticsController {
  private readonly siteUrl: string

  public constructor(
    private readonly historian: Historian,
    @InjectRepository(QuotaRepository)
    private readonly quotaRepo: QuotaRepository,
    private readonly claimRepo: ClaimRepository,
    private readonly tableGenerator: TableGenerator,
    config: Configuration,
    private readonly auditor: AuditorDoctors,
  ) {
    this.siteUrl = config.getStringOrElse('SITE_URL', 'localhost')
  }

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

  @Get('quotas-available')
  @ApiOperation({ title: 'Common quotas avalability' })
  @ApiOkResponse({ description: 'Success' })
  public async commonQuotasAvailable(): Promise<boolean> {
    try {
      const quotas = await this.quotaRepo.findCommonAvailable()

      return quotas.length > 0
    } catch (e) {
      return false
    }
  }

  @Get('closed-claims-report')
  @Header('Content-Type', 'text/csv')
  @Roles(Role.Admin)
  @ApiOperation({ title: 'Common quotas avalability' })
  @ApiDateRangeQuery()
  @ApiOkResponse({ description: 'Success' })
  @ApiForbiddenResponse({ description: 'Admin API token doesn`t provided' })
  public async generateReportForClosedClaims(
    @Query(DateRandePipe) request: DateRangeRequest,
  ): Promise<any> {
    const closedClaims = await this.claimRepo.findClosedByRange(
      request.from,
      request.to,
    )
    const statisticItems = closedClaims.map(
      ClaimStatisticsItem.fromClaim(this.siteUrl),
    )

    const table = await this.tableGenerator.generate(
      statisticItems,
      ClaimStatisticsItem.getHeader(),
    )

    return table
  }

  @Get('claims-report')
  @Header('Content-Type', 'text/csv')
  @Roles(Role.Admin)
  @ApiOperation({ title: 'Common quotas avalability' })
  @ApiDateRangeQuery()
  @ApiOkResponse({ description: 'Success' })
  @ApiForbiddenResponse({ description: 'Admin API token doesn`t provided' })
  public async generateReportForClaims(
    @Query(DateRandePipe) request: DateRangeRequest,
  ): Promise<any> {
    const claims = await this.claimRepo.findByRange(request.from, request.to)
    const statisticItems = claims.map(
      ClaimStatisticsItem.fromClaim(this.siteUrl),
    )

    const table = await this.tableGenerator.generate(
      statisticItems,
      ClaimStatisticsItem.getHeader(),
    )

    return table
  }

  @Get('doctor-answer')
  @Roles(Role.Admin)
  @ApiOperation({ title: 'Doctor velocity' })
  @ApiOkResponse({ description: 'Success' })
  @ApiForbiddenResponse({ description: 'Admin API token doesn`t provided' })
  async getDoctorAnswerTimes(): Promise<DoctorAnswerTimeResponse> {
    const [{ median, average, min, max }, doctors] = await Promise.all([
      this.auditor.calculateAnswerTime(),
      this.auditor.calculateAnswerTimeByDoctors(),
    ])

    return { median, average, min, max, doctors }
  }
}
