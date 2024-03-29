import {
  Controller,
  Get,
  Header,
  Query,
  UseGuards,
  Post,
  Param,
} from '@nestjs/common'
import {
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiOperation,
  ApiUseTags,
  ApiImplicitQuery,
} from '@nestjs/swagger'
import { InjectRepository } from '@nestjs/typeorm'

import { ClaimRepository } from '@app/domain/claim/ClaimRepository'
import QuotaRepository from '@app/domain/quota/QuotaRepository'
import Historian from '@app/domain/service/Historian/Historian'
import { Role } from '@app/user/model/Role'
import { Configuration } from '@app/config/Configuration'
import { AuditorDoctors } from '@app/application/statistic/AuditorDoctors'
import { AuditorClaims } from '@app/application/statistic/AuditorClaims'
import { AuditorRating } from '@app/application/statistic/AuditorRating'

import ApiDateRangeQuery from '../request/dateRange/ApiDateRangeQuery'
import DateRandePipe from '../request/dateRange/DateRangePipe'
import DateRangeRequest from '../request/dateRange/DateRangeRequest'
import { ClaimStatisticsItem } from '../response/ClaimStatisticsItem'
import CompanyResponse from '../response/CompanyResponse'
import JwtAuthGuard from '../security/JwtAuthGuard'
import Roles from '../security/Roles'
import { DoctorAnswerTimeResponse } from '../response/DoctorAnswerTimeResponse'
import { TableGenerator } from '@app/utils/service/TableGenerator/TableGenerator'
import { FunnelClaimsResponse } from './FunnelClaimsResponse'
import { DoctorStatisticsItem } from '../response/DoctorStatisticsItem'
import { RatingValueQuestion } from '@app/application/statistic/RatingValueQuestion'
import { RatingCommentQuestion } from '@app/application/statistic/RatingCommentQuestion'
import DoctorReportByRangeRequest from '../request/DoctorReportByRangeRequest'
import { DoctorReportResponse } from '../response/DoctorReportResponse'
import { formatDoctorAnswerRes } from '../helpers/formatDoctorAnswerRes'

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
    private readonly auditorDoctors: AuditorDoctors,
    private readonly auditorClaims: AuditorClaims,
    private readonly auditorRating: AuditorRating,
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
  @ApiForbiddenResponse({ description: 'Admin API token doesnt provided' })
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
  @ApiForbiddenResponse({ description: 'Admin API token doesnt provided' })
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
  @ApiForbiddenResponse({ description: 'Admin API token doesnt provided' })
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

  @Get('funnel-claims')
  @Roles(Role.Admin)
  @ApiOperation({ title: 'Claims funnel' })
  @ApiDateRangeQuery()
  @ApiOkResponse({ description: 'Success' })
  @ApiForbiddenResponse({ description: 'Admin API token doesnt provided' })
  public async getFunnelClaims(
    @Query(DateRandePipe) request: DateRangeRequest,
  ): Promise<FunnelClaimsResponse> {
    const { from, to } = request
    const funnelInfo = await this.auditorClaims.getFunnel(from, to)

    return funnelInfo
  }

  @Get('doctor-answer')
  @Roles(Role.Admin)
  @ApiOperation({ title: 'Doctor velocity' })
  @ApiOkResponse({ description: 'Success' })
  @ApiForbiddenResponse({ description: 'Admin API token doesnt provided' })
  async getDoctorAnswerTimes(
    @Query(DateRandePipe) request: DateRangeRequest,
  ): Promise<DoctorAnswerTimeResponse> {
    const { from, to } = request

    const [
      { median, average, min, max, all, closedByClient, success, failure },
      doctors,
      rating,
      { ratingAverage, ratingMedian },
    ] = await Promise.all([
      this.auditorDoctors.calculateAnswerTime(from, to),
      this.auditorDoctors.calculateAnswerTimeByDoctors(from, to),
      this.auditorRating.getDoctorsRatingByRange(from, to),
      this.auditorRating.getRatingByAllClaimsByRange(from, to),
    ])

    const res = formatDoctorAnswerRes(doctors, rating)

    return {
      median,
      average,
      min,
      max,
      doctors: res,
      success,
      failure,
      all,
      closedByClient,
      ratingAverage,
      ratingMedian,
    }
  }

  @Get('doctor-report')
  @Roles(Role.Admin)
  @ApiOperation({ title: 'Doctor stats' })
  @ApiOkResponse({ description: 'Success' })
  @ApiForbiddenResponse({ description: 'Admin API token doesnt provided' })
  async getDoctorReportByRange(@Query() query: { name: string }): Promise<
    DoctorReportResponse
  > {
    const { name } = query

    const [info, graphInfo] = await Promise.all([
      this.auditorDoctors.getReportInfo(name),
      this.auditorDoctors.getReportGraphInfo(name),
    ])

    return { ...info, graphInfo }
  }

  @Get('doctor-answer-table')
  @Roles(Role.Admin)
  @ApiOperation({ title: 'Doctor velocity in csv' })
  @ApiOkResponse({ description: 'Success' })
  @ApiForbiddenResponse({ description: 'Admin API token doesnt provided' })
  async getDoctorAnswerTimesTable(
    @Query(DateRandePipe)
    request: DateRangeRequest,
  ): Promise<any> {
    const { from, to } = request

    const [doctors, rating] = await Promise.all([
      this.auditorDoctors.calculateAnswerTimeByDoctors(from, to),
      this.auditorRating.getDoctorsRatingByRange(from, to),
    ])

    const formatted = formatDoctorAnswerRes(doctors, rating)

    const statisticItems = formatted.map(DoctorStatisticsItem.getBody())
    const table = await this.tableGenerator.generate(
      statisticItems,
      DoctorStatisticsItem.getHeader(),
    )

    return table
  }

  @Get('rating-report-value')
  @Header('Content-Type', 'application/json')
  @Roles(Role.Admin)
  @ApiOperation({ title: 'report of value questions' })
  @ApiOkResponse({ description: 'Success' })
  @ApiForbiddenResponse({ description: 'Admin API token doesnt provided' })
  public async generateValueReport(): Promise<RatingValueQuestion[]> {
    const valueQuestions = await this.auditorRating.getRatingValueQuestionsStat()

    return valueQuestions
  }

  @Get('rating-report-comment')
  @Header('Content-Type', 'application/json')
  @Roles(Role.Admin)
  @ApiOperation({ title: 'report of comment questions' })
  @ApiOkResponse({ description: 'Success' })
  @ApiForbiddenResponse({ description: 'Admin API token doesnt provided' })
  public async generateCommentReport(): Promise<RatingCommentQuestion[]> {
    const commentQuestions = await this.auditorRating.getRatingCommentQuestionsStat()

    return commentQuestions
  }

  @Get('rating-report-doctors')
  @Header('Content-Type', 'application/json')
  @Roles(Role.Admin)
  @ApiOperation({ title: 'report of rating doctors' })
  @ApiOkResponse({ description: 'Success' })
  @ApiForbiddenResponse({ description: 'Admin API token doesnt provided' })
  public async generateRatingDoctors(): Promise<any[]> {
    const ratingDoctors = await this.auditorRating.getRatingDoctors()

    return ratingDoctors
  }
}
