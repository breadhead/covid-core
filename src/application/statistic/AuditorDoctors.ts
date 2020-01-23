import { Injectable } from '@nestjs/common'
import { differenceInMilliseconds, differenceInCalendarDays } from 'date-fns'
import { groupBy } from 'lodash'

import { ClaimRepository } from '@app/domain/claim/ClaimRepository'
import Claim from '@app/domain/claim/Claim.entity'
import { getMedian } from '@app/utils/service/median'
import { weekendDurationBetween } from '@app/utils/service/weekendDurationBetween'
import { MS_IN_DAY } from '@app/utils/service/weekendDurationBetween/MS_IN_DAY'
import { getAnswerDate } from './helpers/getAnswerDate'
import { getYearAgoMonthRange } from './helpers/getYearAgoMonthRange'
import { DoctorStat } from '@app/presentation/http/response/DoctorAnswerTimeResponse'

@Injectable()
export class AuditorDoctors {
  constructor(private readonly claimRepo: ClaimRepository) {}

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

  async calculateAnswerTimeByDoctors(
    from: Date,
    to: Date,
  ): Promise<DoctorStat[]> {
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
    const claimsDates = claims.map(claim => {
      return {
        start: claim.sentToDoctorAt,
        end: getAnswerDate(claim),
      }
    })

    const answerTimes = claimsDates
      .filter(({ start, end }) => !!start && !!end)
      .map(({ start, end }) => {
        const weekendDuration = weekendDurationBetween(start, end)
        const fullDuration = Math.abs(differenceInMilliseconds(start, end))
        return fullDuration - weekendDuration
      })

    const success = answerTimes.filter(time => time <= MS_IN_DAY * 2).length
    const failure = answerTimes.filter(time => time > MS_IN_DAY * 2).length

    const closedByClient = this.getClosedByClient(claims).length

    return {
      median: getMedian(answerTimes),
      average: this.average(answerTimes),
      max: Math.max(...[...answerTimes, 0]),
      min: Math.min(...[...answerTimes, 0]),
      all: answerTimes.length,
      closedByClient,
      success,
      failure,
    }
  }

  public async getReportInfo(name: string) {
    const info = getYearAgoMonthRange(new Date()).map(async month => {
      const { first, last, monthName } = month
      const res = await this.calculateAnswerTimeByDoctors(first, last)

      const currentDoctor = res.filter(doc => doc.name === name)[0]

      return { monthName, ...currentDoctor }
    })

    return Promise.all(info)
  }

  private average(values: number[]) {
    const sum = values.reduce((a, b) => a + b, 0)
    const count = values.length

    return Math.round(sum / (count || 1))
  }

  private getClosedByClient(claims: Claim[]) {
    return claims.filter(it => it.closedBy === 'client')
  }
}
