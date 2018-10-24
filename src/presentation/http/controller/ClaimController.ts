import { CommandBus } from '@breadhead/nest-throwable-bus'
import { Body, Controller, Get, HttpCode, Post, Query, UseGuards } from '@nestjs/common'
import {
  ApiBearerAuth, ApiForbiddenResponse, ApiNotFoundResponse,
  ApiOkResponse, ApiOperation, ApiUseTags
} from '@nestjs/swagger'
import { InjectRepository } from '@nestjs/typeorm'

import CloseClaimCommand from '@app/application/claim/CloseClaimCommand'
import CreateClaimCommand from '@app/application/claim/CreateClaimCommand'
import BindQuotaCommand from '@app/application/quota/BindQuotaCommand'
import Claim from '@app/domain/claim/Claim.entity'
import ClaimRepository from '@app/domain/claim/ClaimRepository'
import Role from '@app/domain/user/Role'
import TokenPayload from '@app/infrastructure/security/TokenPayload'

import ShortClaimData from '../io/claim/ShortClaimData'
import BindQuotaRequest from '../request/BindQuotaRequest'
import CloseClaimRequest from '../request/CloseClaimRequest'
import JwtAuthGuard from '../security/JwtAuthGuard'
import Roles from '../security/Roles'
import CurrentUser from './decorator/CurrentUser'
import HttpCodeNoContent from './decorator/HttpCodeNoContent'
import StatusMover from '@app/domain/claim/StatusMover';
import MoveToNextStatusCommand from '@app/application/claim/MoveToNextStatusCommand';

@Controller('claims')
@UseGuards(JwtAuthGuard)
@ApiUseTags('claims')
@ApiBearerAuth()
export default class ClaimController {

  public constructor(
    @InjectRepository(ClaimRepository) private readonly claimRepo: ClaimRepository,
    private readonly bus: CommandBus,
    private readonly statusMover: StatusMover,
  ) { }

  @Get(':id/short')
  @ApiOperation({ title: 'Claim\'s short data' })
  @ApiOkResponse({ description: 'Success', type: ShortClaimData })
  @ApiNotFoundResponse({ description: 'Claim not found' })
  @ApiForbiddenResponse({ description: 'Claim\'s owner, case-manager or doctor API token doesn\'t provided' })
  public async showShort(@Query('id') id: string): Promise<ShortClaimData> {
    const claim = await this.claimRepo.getOne(id)

    return ShortClaimData.fromEntity(claim)
  }

  @Post('short')
  @Roles(Role.Client)
  @ApiOperation({ title: 'Send short claim' })
  @ApiOkResponse({ description: 'Saved', type: ShortClaimData })
  public async sendShortClaim(
    @Body() request: ShortClaimData,
    @CurrentUser() user: TokenPayload,
  ): Promise<ShortClaimData> {
    const { login } = user
    const { theme, diagnosis, company } = request
    const { name, age, gender, region, email, phone } = request.personalData

    const { companyName = null, companyPosition = null } = company
      ? { companyName: company.name, companyPosition: company.position }
      : {}

    const claim: Claim = await this.bus.execute(new CreateClaimCommand(
      login, theme, name, age, gender, region,
      diagnosis, email, phone, companyName, companyPosition,
    ))

    return ShortClaimData.fromEntity(claim)
  }

  @Post('close')
  @Roles(Role.CaseManager, Role.Admin)
  @HttpCodeNoContent()
  @ApiOperation({ title: 'Close quota' })
  @ApiOkResponse({ description: 'Quota closed' })
  @ApiForbiddenResponse({ description: 'Admin or case-manager API token doesn\'t provided' })
  public async closeClaim(
    @Body() request: CloseClaimRequest,
  ): Promise<void> {
    const { id, type, deallocateQuota } = request

    await this.bus.execute(
      new CloseClaimCommand(id, type, deallocateQuota),
    )

    return
  }

  @Post('bind-quota')
  @HttpCode(200)
  @ApiOperation({ title: 'Bind quota to claim' })
  @ApiOkResponse({ description: 'Binded' })
  public async bindQuota(@Body() request: BindQuotaRequest): Promise<void> {
    const { claimId, quotaId } = request
    await this.bus.execute(
      new BindQuotaCommand(quotaId, claimId),
    )

    return
  }

  @Post(':id/next-status')
  @HttpCode(200)
  @ApiOperation({ title: 'Set next staus' })
  @ApiOkResponse({ description: 'Next Status' })
  public async setNextStatus(@Query('id') id: string): Promise<void> {
    await this.bus.execute(
      new MoveToNextStatusCommand(id)
    )

    return
  }

}