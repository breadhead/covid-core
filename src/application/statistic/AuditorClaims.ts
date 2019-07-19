import { Injectable } from '@nestjs/common'
import { ClaimRepository } from '@app/domain/claim/ClaimRepository'

@Injectable()
export class AuditorClaims {
  constructor(private readonly claimRepo: ClaimRepository) {}

  async getFunnel(
    from: Date = new Date('2019-01-01'),
    to: Date = new Date('2020-01-05'),
  ) {
    const shortClaims = await this.claimRepo.getShortClaimsByRange(from, to)

    const situationClaims = await this.claimRepo.getSituationClaimsByRange(
      from,
      to,
    )

    const finishedClaims = await this.claimRepo.getFinishedClaimsByRange(
      from,
      to,
    )

    const sendedToDoctorClaims = await this.claimRepo.getSentToDoctorClaimsByRange(
      from,
      to,
    )

    const answerValidationClaims = await this.claimRepo.getAnswerValidationClaimsByRange(
      from,
      to,
    )

    const sendedToClientClaims = await this.claimRepo.getSendedToClientClaimsByRange(
      from,
      to,
    )

    const successfullyClosedClaims = await this.claimRepo.getSuccessufllyClosedClaimsByRange(
      from,
      to,
    )

    return {
      shortClaims,
      situationClaims,
      finishedClaims,
      sendedToDoctorClaims,
      answerValidationClaims,
      sendedToClientClaims,
      successfullyClosedClaims,
    }
  }
}
