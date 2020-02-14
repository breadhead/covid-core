import { Injectable } from '@nestjs/common'
import { AbstractRepository, EntityRepository } from 'typeorm'
import BaseDoctor from './BaseDoctor.entity'

@Injectable()
@EntityRepository(BaseDoctor)
export class BaseDoctorRepository extends AbstractRepository<BaseDoctor> {
  public async search(
    query: string,
    params: {
      limit: number
    } = {
      limit: 20,
    },
  ): Promise<BaseDoctor[]> {
    const items = await this.repository
      .createQueryBuilder('base_doctor')
      .andWhere('base_doctor.name LIKE :query', { query: `%${query}%` })
      .limit(params.limit)
      .getMany()

    return items
  }
}
