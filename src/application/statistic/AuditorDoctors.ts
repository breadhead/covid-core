import { Injectable } from '@nestjs/common'
import { differenceInMilliseconds } from 'date-fns'
import { groupBy } from 'lodash'

import { ClaimRepository } from '@app/domain/claim/ClaimRepository'
import Claim from '@app/domain/claim/Claim.entity'
import { median } from '@app/infrastructure/utils/median'
import { lastDate } from '@app/utils/infrastructure/lastDate'

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
    const getStartTime = (answeredAt?: Date, answerUpdatedAt?: Date) => {
      if (answeredAt || answerUpdatedAt) {
        return lastDate(answeredAt, answerUpdatedAt)
      }

      return undefined
    }

    const answerTimes = claims
      .map(({ sentToClientAt, answeredAt, answerUpdatedAt }) => ({
        start: getStartTime(answeredAt, answerUpdatedAt),
        end: sentToClientAt,
      }))
      .filter(({ start, end }) => !!start && !!end)
      .map(({ start, end }) => Math.abs(differenceInMilliseconds(start, end)))
      .filter(diff => diff > 1000 * 60 * 15) // more then 30 minutes

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
