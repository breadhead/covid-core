import { Injectable } from '@nestjs/common'
import { ClaimRepository } from '@app/domain/claim/ClaimRepository'

interface Funnel {
  shortClaims: number
  situationClaims: number
  finishedClaims: number
  answerValidationClaims: number
  sendedToDoctorClaims: number
  sendedToClientClaims: number
  successfullyClosedClaims: number
}

@Injectable()
export class AuditorClaims {
  constructor(private readonly claimRepo: ClaimRepository) {}

  async getFunnel(from: Date, to: Date) {
    const [
      shortClaims,
      situationClaims,
      finishedClaims,
      sendedToClientClaims,
      successfullyClosedClaims,
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
      sendedToClientClaims,
      successfullyClosedClaims,
    }
  }
}
