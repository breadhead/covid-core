import { AbstractRepository, EntityRepository } from 'typeorm'

import EntityNotFoundException from '../exception/EntityNotFoundException'
import Quota from './Quota.entity'

@EntityRepository(Quota)
export default class QuotaRepository extends AbstractRepository<Quota> {
  public findAll() {
    return this.repository.find()
  }

  public async getOne(id: number): Promise<Quota> {
    const quota = await this.repository.findOne(id)

    if (!quota) {
      throw new EntityNotFoundException(Quota, { id })
    }

    return quota
  }
}
