import { CommandBus } from '@breadhead/nest-throwable-bus'
import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common'
import {
  ApiBearerAuth, ApiForbiddenResponse, ApiNotFoundResponse,
  ApiOkResponse, ApiOperation, ApiUseTags,
} from '@nestjs/swagger'

import NewClaimCommand from '@app/application/claim/NewClaimCommand'
import Claim from '@app/domain/claim/Claim.entity'
import Gender from '@app/infrastructure/customTypes/Gender'
import TokenPayload from '@app/infrastructure/security/TokenPayload'

import ShortClaimData from '../io/claim/ShortClaimData'
import CurrentUser from '../request/CurrentUser'
import JwtAuthGuard from '../security/JwtAuthGuard'

@Controller('claims')
@UseGuards(JwtAuthGuard)
@ApiUseTags('claims')
@ApiBearerAuth()
export default class ClaimController {

  public constructor(
    private readonly bus: CommandBus,
  ) { }

  @Get(':id/common')
  @ApiOperation({ title: 'Claim\'s common data' })
  @ApiOkResponse({ description: 'Success', type: ShortClaimData })
  @ApiNotFoundResponse({ description: 'Claim not found' })
  @ApiForbiddenResponse({ description: 'Claim\'s owner, case-manager or doctor API token doesn\'t provided '})
  public showShort(@Query('id') id: string): ShortClaimData {
    return {
      id,
      personalData: {
        name: 'fd',
        region: 'fdf',
        age: 23,
        gender: Gender.female,
        email: 'fdfd',
      },
      theme: 'dfdf',
    }
  }

  @Post('/short')
  @ApiOperation({ title: 'Send short claim' })
  @ApiOkResponse({ description: 'Saved', type: ShortClaimData })
  public async sendShortClaim(
    @Body() request: ShortClaimData,
    @CurrentUser() user: TokenPayload,
  ): Promise<ShortClaimData> {
    const { login } = user
    const { theme, diagnosis, company } = request
    const { name, age, gender, region, email, phone } = request.personalData

    const claim: Claim = await this.bus.execute(new NewClaimCommand(
      login, theme, name, age, gender, region,
      diagnosis, email, phone, company.name, company.position,
    ))

    return ShortClaimData.fromEntity(claim)
  }
}
