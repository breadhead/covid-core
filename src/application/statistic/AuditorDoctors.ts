import { Injectable } from '@nestjs/common'
import { differenceInMilliseconds } from 'date-fns'
import { groupBy } from 'lodash'

import { ClaimRepository } from '@app/domain/claim/ClaimRepository'
import Claim from '@app/domain/claim/Claim.entity'
import { median } from '@app/utils/service/median'
import { weekendDurationBetween } from '@app/utils/service/weekendDurationBetween'

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

    return Object.entries(grouped).map(([name, claims]) => ({
      name,
      ...this.answerTime(claims),
    }))
  }

  private answerTime(claims: Claim[]) {
    const answerTimes = claims
      .map(({ sentToClientAt, answeredAt }) => ({
        start: answeredAt,
        end: sentToClientAt,
      }))
      .filter(({ start, end }) => !!start && !!end)
      .map(({ start, end }) => {
        const weekendDuration = weekendDurationBetween(start, end)
        const fullDuration = Math.abs(differenceInMilliseconds(start, end))

        return fullDuration - weekendDuration
      })
      .filter(diff => diff > 0)

    return {
      median: median(answerTimes),
      average: this.average(answerTimes),
      max: Math.max(...[...answerTimes, 0]),
      min: Math.min(...[...answerTimes, 0]),
    }
  }

  private average(values: number[]) {
    const sum = values.reduce((a, b) => a + b, 0)
    const count = values.length

    return Math.round(sum / (count || 1))
  }
}
