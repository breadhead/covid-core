import { AbstractRepository, EntityRepository } from 'typeorm'

import EntityNotFoundException from '../exception/EntityNotFoundException'
import Draft from './Draft.entity'

@EntityRepository(Draft)
export default class DraftRepository extends AbstractRepository<Draft> {
  public async getOne(id: string): Promise<Draft> {
    const draft = await this.repository.findOne(id)

    if (!draft) {
      throw new EntityNotFoundException(Draft.name, { id })
    }

    return draft
  }

  public async getByLogin(login: string): Promise<Draft[]> {
    const claims = await this.repository.find({
      author: { login },
    })

    return claims
  }
}
