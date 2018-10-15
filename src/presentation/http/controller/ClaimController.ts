import { Controller, Get, Query, UseGuards } from '@nestjs/common'
import {
  ApiBearerAuth, ApiForbiddenResponse, ApiNotFoundResponse,
  ApiOkResponse, ApiOperation, ApiUseTags,
} from '@nestjs/swagger'

import CommonClaimResponse from '../response/claim/CommonClaimResponse'
import { Gender } from '../response/claim/PersonalData'
import JwtAuthGuard from '../security/JwtAuthGuard'

@Controller('claims')
@UseGuards(JwtAuthGuard)
@ApiUseTags('claims')
@ApiBearerAuth()
export default class ClaimController {

  @Get(':id/common')
  @ApiOperation({ title: 'Claim\'s common data' })
  @ApiOkResponse({ description: 'Success', type: CommonClaimResponse })
  @ApiNotFoundResponse({ description: 'Claim not found' })
  @ApiForbiddenResponse({ description: 'Claim\'s owner, case-manager or doctor API token doesn\'t provided '})
  public showCommon(@Query('id') id: string): CommonClaimResponse {
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
      urgency: 'fd',
    }
  }
}
