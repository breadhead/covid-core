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
      this.claimRepo.getShortClaimsCountByRange(from, to),
      this.claimRepo.getSituationClaimsCountByRange(from, to),
      this.claimRepo.getFinishedClaimsCountByRange(from, to),
      this.claimRepo.getSentToDoctorClaimsCountByRange(from, to),
      this.claimRepo.getAnswerValidationClaimsCountByRange(from, to),
      this.claimRepo.getSendedToClientClaimsCountByRange(from, to),
      this.claimRepo.getSuccessufllyClosedClaimsCountByRange(from, to),
    ]).then(res => {
      funnel.shortClaims = res[0]
      funnel.situationClaims = res[1]
      funnel.finishedClaims = res[2]
      funnel.sendedToDoctorClaims = res[3]
      funnel.answerValidationClaims = res[4]
      funnel.sendedToClientClaims = res[5]
      funnel.successfullyClosedClaims = res[6]

      return funnel
    })
  }
}
