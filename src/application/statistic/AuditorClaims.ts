import { ClaimRepository } from '@app/domain/claim/ClaimRepository'
import { Injectable } from '@nestjs/common'

interface Funnel {
  firstStep: number
  secondStep: number
  finishedClaims: number
  successfullyClosedClaims: number
  closedByClientClaims: number
}

@Injectable()
export class AuditorClaims {
  constructor(private readonly claimRepo: ClaimRepository) {}

  async getFunnel(from: Date, to: Date) {
    const [
      firstStep,
      secondStep,
      finishedClaims,
      successfullyClosedClaims,
      closedByClientClaims,
    ] = await Promise.all([
      this.claimRepo.getShortClaimsCountByRange(from, to),
      this.claimRepo.getSituationClaimsCountByRange(from, to),
      this.claimRepo.getFinishedClaimsCountByRange(from, to),
      this.claimRepo.getSuccessfullyClosedClaimsCountByRange(from, to),
      this.claimRepo.getClosedByClientClaimsCountByRange(from, to),
    ])

    return {
      firstStep,
      secondStep,
      finishedClaims,
      successfullyClosedClaims,
      closedByClientClaims,
    } as Funnel
  }
}
