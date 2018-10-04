import { AbstractRepository, EntityRepository } from 'typeorm'

import Quota from './Quota.entity'

@EntityRepository(Quota)
export default class QuotaRepository extends AbstractRepository<Quota> {
  public findAll() {
    return this.repository.find()
  }
}
