import { Injectable } from '@nestjs/common'
import { differenceInMilliseconds } from 'date-fns'
import { mean, groupBy } from 'lodash'

import { ClaimRepository } from '@app/domain/claim/ClaimRepository'
import Claim from '@app/domain/claim/Claim.entity'

@Injectable()
export class AuditorDoctors {
  constructor(private readonly claimRepo: ClaimRepository) {}

  async calculateAnswerTime() {
    const allClaims = await this.claimRepo.findAllClosed()

    return this.answerTime(allClaims)
  }

  async calculateAnswerTimeByDoctors() {
    const allClaims = await this.claimRepo.findAllClosed()

    const claimsWithDoctor = allClaims.filter(claim => !!claim.doctor)

    const grouped = groupBy(
      claimsWithDoctor,
      claim => claim.doctor.fullName || claim.doctor.login,
    )

    return Object.entries(grouped).map(([name, claim]) => ({
      name,
      ...this.answerTime(claim),
    }))
  }

  private answerTime(claims: Claim[]) {
    const answerTimes = claims.map(({ sentToClientAt, sentToDoctorAt }) =>
      differenceInMilliseconds(sentToClientAt, sentToDoctorAt),
    )

    return {
      median: this.median(answerTimes),
      average: mean(answerTimes),
    }
  }

  private median(values: number[]) {
    const sorted = values.sort((a, b) => a - b)

    const meanIndex = Math.trunc(sorted.length / 2)

    return sorted[meanIndex]
  }
}
