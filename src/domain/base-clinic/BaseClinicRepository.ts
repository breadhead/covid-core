import { Injectable } from '@nestjs/common'
import { AbstractRepository, EntityRepository } from 'typeorm'
import BaseClinic from './BaseClinic.entity'

@Injectable()
@EntityRepository(BaseClinic)
export class BaseClinicRepository extends AbstractRepository<BaseClinic> {
  public async searchByName(
    name: string,
    params: {
      limit: number
    } = {
      limit: 20,
    },
  ): Promise<BaseClinic[]> {
    const items = await this.repository
      .createQueryBuilder('base_clinic')
      .andWhere('base_clinic.name LIKE :name', { name: `%${name}%` })
      .limit(params.limit)
      .getMany()

    return items
  }

  public async searchByRegion(
    region: string,
    params: {
      limit: number
    } = {
      limit: 20,
    },
  ): Promise<BaseClinic[]> {
    const items = await this.repository
      .createQueryBuilder('base_clinic')
      .andWhere('base_clinic.region LIKE :region', { region: `%${region}%` })
      .limit(params.limit)
      .getMany()

    return items
  }
}
