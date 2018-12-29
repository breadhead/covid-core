import { CommandBus } from '@breadhead/nest-throwable-bus'
import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common'
import {
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiUseTags,
} from '@nestjs/swagger'
import { InjectRepository } from '@nestjs/typeorm'
import { sortBy } from 'lodash'

import AskQuestionsCommand from '@app/application/claim/AskQuestionsCommand'
import CloseClaimCommand from '@app/application/claim/CloseClaimCommand'
import CreateClaimCommand from '@app/application/claim/CreateClaimCommand'
import MoveToNextStatusCommand from '@app/application/claim/MoveToNextStatusCommand'
import EditSituationCommand from '@app/application/claim/situation/EditSituationCommand'
import BindQuotaCommand from '@app/application/quota/BindQuotaCommand'
import Claim from '@app/domain/claim/Claim.entity'
import ClaimRepository from '@app/domain/claim/ClaimRepository'
import Role from '@app/domain/user/Role'
import Attribute from '@app/infrastructure/security/SecurityVoter/Attribute'
import SecurityVotersUnity from '@app/infrastructure/security/SecurityVoter/SecurityVotersUnity'
import TokenPayload from '@app/infrastructure/security/TokenPayload'

import QuestionsClaimData from '../io/claim/QuestionsClaimData'
import ShortClaimData from '../io/claim/ShortClaimData'
import SituationClaimData from '../io/claim/SituationClaimData'
import BindQuotaRequest from '../request/BindQuotaRequest'
import CloseClaimRequest from '../request/CloseClaimRequest'
import ClaimForListResponse from '../response/ClaimForListResponse'
import ClaimQuotaResponse from '../response/ClaimQuotaResponse'
import JwtAuthGuard from '../security/JwtAuthGuard'
import Roles from '../security/Roles'
import CurrentUser from './decorator/CurrentUser'
import HttpCodeNoContent from './decorator/HttpCodeNoContent'

@Controller('claims')
@UseGuards(JwtAuthGuard)
@ApiUseTags('claims')
@ApiBearerAuth()
export default class ClaimController {
  public constructor(
    @InjectRepository(ClaimRepository)
    private readonly claimRepo: ClaimRepository,
    private readonly bus: CommandBus,
    private readonly votersUnity: SecurityVotersUnity,
  ) {}

  @Get('/')
  @ApiOperation({ title: 'Show list of quotas' })
  @ApiOkResponse({
    description: 'Success',
    type: ClaimForListResponse,
    isArray: true,
  })
  @ApiForbiddenResponse({
    description: 'Client, case-manager or doctor API token doesn`t provided',
  })
  public async showClientList(@CurrentUser() { login }: TokenPayload): Promise<
    ClaimForListResponse[]
  > {
    const claims = await this.claimRepo.getByLogin(login)

    const responseItems = sortBy(
      claims.map(ClaimForListResponse.fromClaim),
      (claim: ClaimForListResponse) => claim.createdAt,
    )

    return responseItems
  }

  @Get(':id/short')
  @ApiOperation({ title: 'Claim`s short data' })
  @ApiOkResponse({ description: 'Success', type: ShortClaimData })
  @ApiNotFoundResponse({ description: 'Claim not found' })
  @ApiForbiddenResponse({
    description:
      'Claim`s owner, case-manager or doctor API token doesn`t provided',
  })
  public async showShort(
    @Param('id') id: string,
    @CurrentUser() user: TokenPayload,
  ): Promise<ShortClaimData> {
    const claim = await this.claimRepo.getOne(id)

    await this.votersUnity.denyAccessUnlessGranted(Attribute.Show, claim, user)

    return ShortClaimData.fromEntity(claim)
  }

  @Get(':id/situation')
  @ApiOperation({ title: 'Claim`s situations data' })
  @ApiOkResponse({ description: 'Success', type: ShortClaimData })
  @ApiNotFoundResponse({ description: 'Claim not found' })
  @ApiForbiddenResponse({
    description:
      'Claim`s owner, case-manager or doctor API token doesn`t provided',
  })
  public async showSituation(
    @Param('id') id: string,
    @CurrentUser() user: TokenPayload,
  ): Promise<SituationClaimData> {
    const claim = await this.claimRepo.getOne(id)

    await this.votersUnity.denyAccessUnlessGranted(Attribute.Show, claim, user)

    return SituationClaimData.fromEntity(claim)
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

    const claim: Claim = await this.bus.execute(
      new CreateClaimCommand(
        login,
        theme,
        name,
        age,
        gender,
        region,
        diagnosis,
        email,
        phone,
        companyName,
        companyPosition,
      ),
    )

    return ShortClaimData.fromEntity(claim)
  }

  @Post('sutiation')
  @ApiOperation({ title: 'Send situation to claim' })
  @ApiOkResponse({ description: 'Saved', type: SituationClaimData })
  public async sendSituation(
    @Body() request: SituationClaimData,
    @CurrentUser() user: TokenPayload,
  ): Promise<SituationClaimData> {
    const {
      id,
      stage,
      worst,
      feeling,
      diagnosis,
      complaint,
      histology,
      discharge,
      otherFiles,
      description,
      nowTreatment,
      otherDisease,
      diagnosisDate,
      relativesDiseases,
      surgicalTreatments,
      medicalsTreatments,
      radiationTreatments,
    } = request
    const claim = await this.claimRepo.getOne(id)
    await this.votersUnity.denyAccessUnlessGranted(Attribute.Edit, claim, user)

    const command: EditSituationCommand = new EditSituationCommand(
      id,
      description,
      feeling,
      diagnosis,
      stage,
      otherDisease,
      worst,
      complaint,
      nowTreatment,
      relativesDiseases,
      surgicalTreatments,
      medicalsTreatments,
      radiationTreatments,
      histology,
      discharge,
      otherFiles,
      diagnosisDate,
    )
    const editiedClaim: Claim = await this.bus.execute(command)

    return SituationClaimData.fromEntity(editiedClaim)
  }

  @Post('questions')
  @ApiOperation({ title: 'Ask questions for claim' })
  @ApiOkResponse({ description: 'Saved', type: QuestionsClaimData })
  public async askQuestions(
    @Body() request: QuestionsClaimData,
    @CurrentUser() user: TokenPayload,
  ): Promise<QuestionsClaimData> {
    const { id, defaultQuestions, additionalQuestions } = request

    const claim = await this.claimRepo.getOne(id)
    await this.votersUnity.denyAccessUnlessGranted(Attribute.Edit, claim, user)

    const editedClaim: Claim = await this.bus.execute(
      new AskQuestionsCommand(id, defaultQuestions, additionalQuestions),
    )

    return QuestionsClaimData.fromEntity(editedClaim)
  }

  @Post('close')
  @Roles(Role.CaseManager, Role.Admin)
  @HttpCodeNoContent()
  @ApiOperation({ title: 'Close quota' })
  @ApiOkResponse({ description: 'Quota closed' })
  @ApiForbiddenResponse({
    description: 'Admin or case-manager API token doesn`t provided',
  })
  public async closeClaim(@Body() request: CloseClaimRequest): Promise<void> {
    const { id, type, deallocateQuota } = request

    await this.bus.execute(new CloseClaimCommand(id, type, deallocateQuota))

    return
  }

  @Post('bind-quota')
  @Roles(Role.CaseManager, Role.Admin)
  @HttpCode(200)
  @ApiOperation({ title: 'Bind quota to claim' })
  @ApiOkResponse({ description: 'Binded' })
  public async bindQuota(@Body() request: BindQuotaRequest): Promise<void> {
    const { claimId, quotaId } = request
    await this.bus.execute(new BindQuotaCommand(quotaId, claimId))

    return
  }

  @Post(':id/next-status')
  @Roles(Role.CaseManager, Role.Admin)
  @HttpCode(200)
  @ApiOperation({ title: 'Move to next staus' })
  @ApiOkResponse({ description: 'Moved to next' })
  public async setNextStatus(@Query('id') id: string): Promise<void> {
    await this.bus.execute(new MoveToNextStatusCommand(id))

    return
  }

  @Get(':id/quota')
  @ApiOperation({ title: 'Claim`s quota data' })
  @ApiOkResponse({ description: 'Success', type: ShortClaimData })
  @ApiNotFoundResponse({ description: 'Claim not found' })
  @ApiForbiddenResponse({
    description:
      'Claim`s owner, case-manager or doctor API token doesn`t provided',
  })
  public async showInfoForClaim(
    @Param('id') id: string,
    @CurrentUser() user: TokenPayload,
  ): Promise<ClaimQuotaResponse> {
    const claim = await this.claimRepo.getOne(id)
    await this.votersUnity.denyAccessUnlessGranted(Attribute.Show, claim, user)

    return ClaimQuotaResponse.fromEntity(claim.quota)
  }
}
