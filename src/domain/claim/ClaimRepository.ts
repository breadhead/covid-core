import { Repository } from 'typeorm'

import {
  endOfDay,
  startOfDay,
  subDays,
  differenceInMilliseconds,
} from 'date-fns'
import EntityNotFoundException from '../exception/EntityNotFoundException'

import Claim, { ClaimStatus, CLOSED_STATUSES } from './Claim.entity'
import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Status } from '@app/presentation/http/response/ClaimForListResponse'
import { MS_IN_DAY } from '@app/utils/service/weekendDurationBetween/MS_IN_DAY'
import { Role } from '@app/user/model/Role'

@Injectable()
class ClaimRepo {
  constructor(
    @InjectRepository(Claim)
    private readonly repository: Repository<Claim>,
  ) {}

  public async getOne(id: string): Promise<Claim> {
    const claim = await this.repository.findOne(id)

    if (!claim) {
      throw new EntityNotFoundException(Claim.name, { id })
    }

    return claim
  }

  public async getByLogin(login: string): Promise<Claim[]> {
    const claims = await this.repository.find({
      author: { login },
    })

    return claims
  }

  public async getSuccessClaimsCount(): Promise<number> {
    const claimsCount = await this.repository
      .createQueryBuilder('claim')
      .where('claim._status in (:statuses)', {
        statuses: [ClaimStatus.ClosedSuccessfully],
      })
      .getCount()

    return claimsCount
  }

  public async findClosedByRange(from: Date, to: Date): Promise<Claim[]> {
    const start = startOfDay(from).toISOString()
    const end = endOfDay(to).toISOString()

    return this.repository
      .createQueryBuilder('claim')
      .leftJoinAndSelect('claim.author', 'author')
      .leftJoinAndSelect('claim._doctor', 'doctor')
      .leftJoinAndSelect('claim._quota', 'auota')
      .where('claim._status in (:statuses)', { statuses: CLOSED_STATUSES })
      .andWhere('claim._closedAt >= :start', { start })
      .andWhere('claim._closedAt <= :end', { end })
      .getMany()
  }

  async findAllClosed(): Promise<Claim[]> {
    return this.repository
      .createQueryBuilder('claim')
      .leftJoinAndSelect('claim.author', 'author')
      .leftJoinAndSelect('claim._doctor', 'doctor')
      .leftJoinAndSelect('claim._quota', 'auota')
      .where('claim._status in (:statuses)', {
        statuses: [
          ...CLOSED_STATUSES,
          Status.DeliveredToCustomer,
          Status.AnswerValidation,
        ],
      })
      .getMany()
  }

  public async findByRange(from: Date, to: Date): Promise<Claim[]> {
    const start = startOfDay(from).toISOString()
    const end = endOfDay(to).toISOString()

    return this.repository
      .createQueryBuilder('claim')
      .leftJoinAndSelect('claim.author', 'author')
      .leftJoinAndSelect('claim._doctor', 'doctor')
      .leftJoinAndSelect('claim._quota', 'quota')
      .where('claim._status NOT IN (:excludeStatuses)', {
        excludeStatuses: [ClaimStatus.QuestionnaireWaiting],
      })
      .andWhere('claim.createdAt >= :start', { start })
      .andWhere('claim.createdAt <= :end', { end })
      .getMany()
  }

  public async count(): Promise<number> {
    return this.repository.count()
  }

  public async findClaimsForFeedbackReminder() {
    const start = subDays(new Date(), 4).toISOString()

    const claims = await this.repository
      .createQueryBuilder('claim')
      .leftJoinAndSelect('claim.author', 'author')
      .where('claim._sentToClientAt <= :start', { start })
      .andWhere('claim._sentToClientAt IS NOT NULL')
      .andWhere('claim._isFeedbackReminderSent = false')
      .getMany()

    return claims
  }

  public async getShortClaimsCountByRange(
    from: Date,
    to: Date,
  ): Promise<number> {
    const start = startOfDay(from).toISOString()
    const end = endOfDay(to).toISOString()

    const count = await this.repository
      .createQueryBuilder('claim')
      .where('claim.createdAt >= :start', { start })
      .andWhere('claim.createdAt <= :end', { end })
      .getCount()

    return count
  }

  public async getSituationClaimsCountByRange(
    from: Date,
    to: Date,
  ): Promise<number> {
    const start = startOfDay(from).toISOString()
    const end = endOfDay(to).toISOString()

    const count = await this.repository
      .createQueryBuilder('claim')
      .where('claim.createdAt >= :start', { start })
      .andWhere('claim.createdAt <= :end', { end })
      .andWhere('claim._situationAddedAt IS NOT NULL')
      .getCount()

    return count
  }

  public async getFinishedClaimsCountByRange(
    from: Date,
    to: Date,
  ): Promise<number> {
    const start = startOfDay(from).toISOString()
    const end = endOfDay(to).toISOString()

    const count = await this.repository
      .createQueryBuilder('claim')
      .where('claim.createdAt >= :start', { start })
      .andWhere('claim.createdAt <= :end', { end })
      .andWhere('claim._claimFinishedAt IS NOT NULL')
      .getCount()

    return count
  }

  public async getSendedToClientClaimsCountByRange(
    from: Date,
    to: Date,
  ): Promise<number> {
    const start = startOfDay(from).toISOString()
    const end = endOfDay(to).toISOString()

    const count = await this.repository
      .createQueryBuilder('claim')
      .where('claim.createdAt >= :start', { start })
      .andWhere('claim.createdAt <= :end', { end })
      .andWhere('claim._status = :closedSuccessfullyStatus', {
        closedSuccessfullyStatus: ClaimStatus.ClosedSuccessfully,
      })
      .getCount()

    return count
  }

  public async getSuccessufllyClosedClaimsCountByRange(
    from: Date,
    to: Date,
  ): Promise<number> {
    const start = startOfDay(from).toISOString()
    const end = endOfDay(to).toISOString()

    const count = await this.repository
      .createQueryBuilder('claim')
      .where('claim.createdAt >= :start', { start })
      .andWhere('claim.createdAt <= :end', { end })
      .andWhere('claim.closedBy = :clientRole', { clientRole: Role.Client })
      .getCount()

    return count
  }

  public async getDoctorActiveClaimsCount(doctorLogin: string) {
    return this.repository
      .createQueryBuilder('claim')
      .leftJoinAndSelect('claim._doctor', 'doctor')
      .where('claim._status = :status', { status: ClaimStatus.AtTheDoctor })
      .andWhere('claim._doctor.login = :doctorLogin', { doctorLogin })
      .getCount()
  }

  public async getDoctorOverdueClaimsCount(doctorLogin: string) {
    const now = new Date().toISOString()

    return this.repository
      .createQueryBuilder('claim')
      .leftJoinAndSelect('claim._doctor', 'doctor')
      .where('claim._status = :status', { status: ClaimStatus.AtTheDoctor })
      .andWhere('claim._doctor.login = :doctorLogin', { doctorLogin })
      .andWhere('claim._due >= :now', { now })
      .getCount()
  }

  async findAlmostOverdue() {
    const now = new Date().toISOString()

    const activeClaims = await this.repository
      .createQueryBuilder('claim')
      .leftJoinAndSelect('claim.author', 'author')
      .leftJoinAndSelect('claim._doctor', 'doctor')
      .leftJoinAndSelect('claim._quota', 'quota')
      .where('claim._status = :status', { status: ClaimStatus.AtTheDoctor })
      .andWhere('claim.overdueNotificated = :notificated', {
        notificated: false,
      })
      .getMany()

    return activeClaims.filter(
      claim =>
        Math.abs(
          differenceInMilliseconds(claim.due.getOrElse(new Date()), now),
        ) <
        MS_IN_DAY / 2,
    )
  }
}

export const ClaimRepository = ClaimRepo
export type ClaimRepository = ClaimRepo
