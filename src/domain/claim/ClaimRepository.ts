import { AbstractRepository, EntityRepository } from 'typeorm'

import EntityNotFoundException from '../exception/EntityNotFoundException'
import Claim from './Claim.entity'

@EntityRepository(Claim)
export default class ClaimRepository extends AbstractRepository<Claim> {
  public async getOne(id: string): Promise<Claim> {
    const claim = await this.repository.findOne(id)

    if (!claim) {
      throw new EntityNotFoundException(Claim.name, { id })
    }

    return claim
  }
}