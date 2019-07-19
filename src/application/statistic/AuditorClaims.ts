import { Injectable } from '@nestjs/common'
import { ClaimRepository } from '@app/domain/claim/ClaimRepository'

@Injectable()
export class AuditorClaims {
  constructor(private readonly claimRepo: ClaimRepository) {}

  async getFunnel(from: Date = new Date('2019-01-01'), to: Date = new Date()) {
    const questionnaireWaitingClaims = await this.claimRepo.getQuestionnaireWaitingClaimsByRange(
      from,
      to,
    )

    return {}
  }
}
