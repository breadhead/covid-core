import { Injectable } from '@nestjs/common'
import { AbstractRepository, EntityRepository } from 'typeorm'
import BaseClinic from './BaseClinic.entity'

@Injectable()
@EntityRepository(BaseClinic)
export class BaseClinicRepository extends AbstractRepository<BaseClinic> {
  public async search(
    query: string,
    params: {
      limit: number
    } = {
      limit: 20,
    },
  ): Promise<BaseClinic[]> {
    const items = await this.repository
      .createQueryBuilder('base_clinic')
      .andWhere('base_clinic.name LIKE :query', { query: `%${query}%` })
      .limit(params.limit)
      .getMany()

    return items
  }
}
