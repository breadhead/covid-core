import { EntityRepository, Repository } from 'typeorm'

import Quota from './Quota.entity'

@EntityRepository(Quota)
export default class QuotaRepository extends Repository<Quota> {
  public findAll() {
    return this.find()
  }
}
