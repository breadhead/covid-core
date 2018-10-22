import { CommandBus } from '@breadhead/nest-throwable-bus'
import { Controller, Get, Post, Query, UseGuards } from '@nestjs/common'
import {
  ApiBearerAuth, ApiForbiddenResponse, ApiNotFoundResponse,
  ApiOkResponse, ApiOperation, ApiUseTags,
} from '@nestjs/swagger'

import NewClaimCommand from '@app/application/claim/NewClaimCommand'

import { Gender } from '../response/claim/PersonalData'
import ShortClaimResponse from '../response/claim/ShortClaimResponse'
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
  @ApiOkResponse({ description: 'Success', type: ShortClaimResponse })
  @ApiNotFoundResponse({ description: 'Claim not found' })
  @ApiForbiddenResponse({ description: 'Claim\'s owner, case-manager or doctor API token doesn\'t provided '})
  public showShort(@Query('id') id: string): ShortClaimResponse {
    return {
      id,
      personalData: {
        name: 'fd',
        region: 'fdf',
        age: 23,
        gender: Gender.female,
        client: {
          id: 'fdf',
          email: 'fdfd',
        },
      },
      theme: 'dfdf',
    }
  }

  @Post('/short')
  @ApiOperation({ title: 'Send short claim' })
  @ApiOkResponse({ description: 'Saved', type: ShortClaimResponse })
  public async sendShortClaim(): Promise<ShortClaimResponse> {
    await this.bus.execute(new NewClaimCommand())

    return {
      id: '12',
      personalData: {
        name: 'fd',
        region: 'fdf',
        age: 23,
        gender: Gender.female,
        client: {
          id: 'fdf',
          email: 'fdfd',
        },
      },
      theme: 'dfdf',
    }
  }
}
