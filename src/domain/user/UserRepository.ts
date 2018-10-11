import { AbstractRepository, EntityRepository } from 'typeorm'

import EntityNotFoundException from '../exception/EntityNotFoundException'
import User from './User.entity'

@EntityRepository(User)
export default class UserRepository extends AbstractRepository<User> {
  public async getOne(id: string): Promise<User> {
    const user = await this.repository.findOne(id)

    if (!user) {
      throw new EntityNotFoundException(User.name, { id })
    }

    return user
  }
}
