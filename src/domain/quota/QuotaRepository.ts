import { AbstractRepository, EntityRepository } from 'typeorm'

import EntityNotFoundException from '../exception/EntityNotFoundException'
import Quota from './Quota.entity'

@EntityRepository(Quota)
export default class QuotaRepository extends AbstractRepository<Quota> {
  public findAll() {
    return this.repository.find()
  }

  public async getOne(id: string): Promise<Quota> {
    const quota = await this.repository.findOne(id)

    if (!quota) {
      throw new EntityNotFoundException(Quota.name, { id })
    }

    return quota
  }

  public findOneByName(name: string): Promise<Quota | null> {
    return this.repository.findOne({
      where: { name },
    })
  }
}
