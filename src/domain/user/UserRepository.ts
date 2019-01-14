import { AbstractRepository, EntityRepository } from 'typeorm'

import EntityNotFoundException from '../exception/EntityNotFoundException'
import User from './User.entity'

@EntityRepository(User)
export default class UserRepository extends AbstractRepository<User> {
  public findOne(login: string): Promise<User | null> {
    return this.repository.findOne(login)
  }

  public async getOne(login: string): Promise<User> {
    const user = await this.findOne(login)

    if (!user) {
      throw new EntityNotFoundException(User.name, { login })
    }

    return user
  }

  public findOneByCabinetId(id: number): Promise<User | null> {
    return this.repository.findOne({
      where: {
        _nenaprasnoCabinetCredentials: { id },
      },
    })
  }
}
