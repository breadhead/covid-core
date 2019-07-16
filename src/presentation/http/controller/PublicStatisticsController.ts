import { Controller, Get } from '@nestjs/common'
import {
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiOperation,
  ApiUseTags,
} from '@nestjs/swagger'

import { ClaimRepository } from '@app/domain/claim/ClaimRepository'

@Controller('public-statistics')
@ApiUseTags('public-statistics')
export default class StatisticsController {
  public constructor(private readonly claimRepo: ClaimRepository) {}

  @Get('success-closed-claims-count')
  @ApiOperation({ title: 'number of successfully closed claims' })
  @ApiOkResponse({ description: 'Success' })
  @ApiForbiddenResponse({ description: 'Admin API token doesn`t provided' })
  public async generateSuccessClaimsCount(): Promise<number> {
    const closedClaimsCount = await this.claimRepo.getSuccessClaimsCount()
    return closedClaimsCount
  }
}
