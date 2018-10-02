import { Controller, Get, Query } from '@nestjs/common'
import {
  ApiForbiddenResponse, ApiNotFoundResponse, ApiOkResponse,
  ApiOperation, ApiUseTags,
} from '@nestjs/swagger'

import CommonClaimResponse from '../response/claim/CommonClaimResponse'
import { Gender } from '../response/claim/PersonalData'

@Controller('claims')
@ApiUseTags('claims')
export default class ClaimController {

  @Get(':id/common')
  @ApiOperation({ title: 'Common claim\'s data' })
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
