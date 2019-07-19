import { Repository } from 'typeorm'

import { endOfDay, startOfDay, subDays } from 'date-fns'
import EntityNotFoundException from '../exception/EntityNotFoundException'

import Claim, { ClaimStatus, CLOSED_STATUSES } from './Claim.entity'
import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Status } from '@app/presentation/http/response/ClaimForListResponse'

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

  public async getQuestionnaireWaitingClaimsByRange(from: Date, to: Date) {
    const start = startOfDay(from).toISOString()
    const end = endOfDay(to).toISOString()

    const claims = await this.repository
      .createQueryBuilder('claim')
      .where('claim._status in (:statuses)', {
        statuses: [ClaimStatus.QuestionnaireWaiting],
      })
      .andWhere('claim._closedAt >= :start', { start })
      .andWhere('claim._closedAt <= :end', { end })
      .getCount()

    return claims
  }

  public async getAllQuestionnaireValidationClaims() {
    const claims = await this.repository
      .createQueryBuilder('claim')
      .where('claim._status in (:statuses)', {
        statuses: [ClaimStatus.QuestionnaireValidation],
      })
      .getMany()

    return claims
  }

  // public async getAllQuestionnaireFinishedClaims() {
  //   const claims = await this.repository
  //     .createQueryBuilder('claim')
  //     .where('claim._status in (:statuses)', {
  //       statuses: [ClaimStatus.QuestionnaireFinished],
  //     }).getMany()

  //   return claims
  // }

  public async getAllAnswerValidationClaims() {
    const claims = await this.repository
      .createQueryBuilder('claim')
      .where('claim._status in (:statuses)', {
        statuses: [ClaimStatus.AnswerValidation],
      })
      .getMany()

    return claims
  }

  public async getAllDeliveredToCustomerClaims() {
    const claims = await this.repository
      .createQueryBuilder('claim')
      .where('claim._status in (:statuses)', {
        statuses: [ClaimStatus.DeliveredToCustomer],
      })
      .getMany()

    return claims
  }

  public async getAllClosedSuccessfullyClaims() {
    const claims = await this.repository
      .createQueryBuilder('claim')
      .where('claim._status in (:statuses)', {
        statuses: [ClaimStatus.ClosedSuccessfully],
      })
      .getMany()

    return claims
  }
}

export const ClaimRepository = ClaimRepo
export type ClaimRepository = ClaimRepo
