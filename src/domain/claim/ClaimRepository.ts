import { AbstractRepository, EntityRepository } from 'typeorm'

import { endOfDay, startOfDay } from 'date-fns'
import EntityNotFoundException from '../exception/EntityNotFoundException'

import Claim, { ClaimStatus, CLOSED_STATUSES } from './Claim.entity'

@EntityRepository(Claim)
export default class ClaimRepository extends AbstractRepository<Claim> {
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

  public async findByRange(from: Date, to: Date): Promise<Claim[]> {
    const start = startOfDay(from).toISOString()
    const end = endOfDay(to).toISOString()

    return this.repository
      .createQueryBuilder('claim')
      .leftJoinAndSelect('claim.author', 'author')
      .leftJoinAndSelect('claim._doctor', 'doctor')
      .leftJoinAndSelect('claim._quota', 'auota')
      .andWhere('claim.createdAt >= :start', { start })
      .andWhere('claim.createdAt <= :end', { end })
      .getMany()
  }

  public async count(): Promise<number> {
    return this.repository.count()
  }

  public async findClaimsForFeedbackReminder() {
    const claims = await this.repository.find({
      status: ClaimStatus.DeliveredToCustomer,
    })
  }
}
