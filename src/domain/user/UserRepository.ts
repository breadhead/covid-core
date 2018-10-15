import { AbstractRepository, EntityRepository } from 'typeorm'

import EntityNotFoundException from '../exception/EntityNotFoundException'
import User from './User.entity'

@EntityRepository(User)
export default class UserRepository extends AbstractRepository<User> {
  public async getOne(login: string): Promise<User> {
    const user = await this.repository.findOne(login)

    if (!user) {
      throw new EntityNotFoundException(User.name, { login })
    }

    return user
  }
}
