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
    const funnel = {} as Funnel

    return Promise.all([
      this.claimRepo.getShortClaimsByRange(from, to),
      this.claimRepo.getSituationClaimsByRange(from, to),
      this.claimRepo.getFinishedClaimsByRange(from, to),
      this.claimRepo.getSentToDoctorClaimsByRange(from, to),
      this.claimRepo.getAnswerValidationClaimsByRange(from, to),
      this.claimRepo.getSendedToClientClaimsByRange(from, to),
      this.claimRepo.getSuccessufllyClosedClaimsByRange(from, to),
    ]).then(res => {
      funnel.shortClaims = res[0]
      funnel.situationClaims = res[1]
      funnel.finishedClaims = res[2]
      funnel.answerValidationClaims = res[3]
      funnel.sendedToDoctorClaims = res[4]
      funnel.sendedToClientClaims = res[5]
      funnel.successfullyClosedClaims = res[6]

      return funnel
    })
  }
}
