import { Injectable } from '@nestjs/common'
import { differenceInMilliseconds, differenceInCalendarDays } from 'date-fns'
import { groupBy } from 'lodash'

import { ClaimRepository } from '@app/domain/claim/ClaimRepository'
import Claim from '@app/domain/claim/Claim.entity'
import { median } from '@app/utils/service/median'
import { weekendDurationBetween } from '@app/utils/service/weekendDurationBetween'
import { MS_IN_DAY } from '@app/utils/service/weekendDurationBetween/MS_IN_DAY'
import { Logger } from '@app/utils/service/Logger/Logger'

@Injectable()
export class AuditorDoctors {
  constructor(
    private readonly claimRepo: ClaimRepository,
    private readonly logger: Logger,
  ) {}

  async getCurrentStatusForDoctor(doctorLogin: string) {
    const [activeCount, overdueCount] = await Promise.all([
      this.claimRepo.getDoctorActiveClaimsCount(doctorLogin),
      this.claimRepo.getDoctorOverdueClaimsCount(doctorLogin),
    ])

    return {
      activeCount,
      overdueCount,
    }
  }

  async calculateAnswerTime(from: Date, to: Date) {
    const allClaims = await this.claimRepo.findSuccessefullyClosedByRange(
      from,
      to,
    )

    const claimsWithDoctor = allClaims.filter(claim => !!claim.doctor)

    return this.answerTime(claimsWithDoctor)
  }

  async calculateAnswerTimeByDoctors(from: Date, to: Date) {
    const allClaims = await this.claimRepo.findSuccessefullyClosedByRange(
      from,
      to,
    )

    const claimsWithDoctor = allClaims.filter(claim => !!claim.doctor)

    const grouped = groupBy(
      claimsWithDoctor,
      claim => claim.doctor.fullName || claim.doctor.login,
    )

    return Object.entries(grouped).map(([name, claims]) => {
      return {
        name,
        ...this.answerTime(claims),
      }
    })
  }

  private answerTime(claims: Claim[]) {
    this.logger.warn(`claims: ${claims.length}`)
    const claimsDates = claims.map(claim => {
      return {
        start: claim.sentToDoctorAt,
        end: claim.answeredAt,
      }
    })

    this.logger.warn(`claimsDates: ${claimsDates.length}`)

    const answerTimes = claimsDates
      .filter(({ start, end }) => !!start && !!end)
      .map(({ start, end }) => {
        const weekendDuration = weekendDurationBetween(start, end)
        const fullDuration = Math.abs(differenceInMilliseconds(start, end))
        return fullDuration - weekendDuration
      })
      .filter(diff => diff >= 0)

    const success = answerTimes.filter(time => time <= MS_IN_DAY * 2).length
    const failure = answerTimes.filter(time => time > MS_IN_DAY * 2).length

    return {
      median: median(answerTimes),
      average: this.average(answerTimes),
      max: Math.max(...[...answerTimes, 0]),
      min: Math.min(...[...answerTimes, 0]),
      success,
      failure,
    }
  }

  private average(values: number[]) {
    const sum = values.reduce((a, b) => a + b, 0)
    const count = values.length

    return Math.round(sum / (count || 1))
  }
}
