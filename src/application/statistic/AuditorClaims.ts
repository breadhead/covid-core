import { Injectable } from '@nestjs/common'
import { ClaimRepository } from '@app/domain/claim/ClaimRepository'

interface Funnel {
  shortClaims: number
  situationClaims: number
  finishedClaims: number
  successfullyClosedClaims: number
  closedByClientClaims: number
}

@Injectable()
export class AuditorClaims {
  constructor(private readonly claimRepo: ClaimRepository) {}

  async getFunnel(from: Date, to: Date) {
    const [
      shortClaims,
      situationClaims,
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
      shortClaims,
      situationClaims,
      finishedClaims,
      successfullyClosedClaims,
      closedByClientClaims,
    } as Funnel
  }
}
