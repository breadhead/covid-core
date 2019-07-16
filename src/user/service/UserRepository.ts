import { Repository } from 'typeorm'
import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'

import EntityNotFoundException from '@app/domain/exception/EntityNotFoundException'

import { Role } from '../model/Role'
import { User } from '../model/User.entity'

@Injectable()
class UserRepo {
  constructor(
    @InjectRepository(User)
    private readonly repository: Repository<User>,
  ) {}

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

  async findOneByContactEmail(email: string): Promise<User | null> {
    return await this.repository.findOne({
      where: {
        _contacts: { email },
      },
    })
  }

  async getOneByContactEmail(email: string): Promise<User> {
    const user = await this.findOneByContactEmail(email)

    if (!user) {
      throw new EntityNotFoundException(User.name, { email })
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

  public findCaseManager(): Promise<User> {
    return this.repository
      .createQueryBuilder('user')
      .where('user._roles like :role', {
        role: `%${Role.CaseManager}%`,
      })
      .getOne()
  }

  public findDoctors(): Promise<User[]> {
    return this.repository
      .createQueryBuilder('user')
      .where('user._roles like :role', {
        role: `%${Role.Doctor}%`,
      })
      .getMany()
  }
}

export const UserRepository = UserRepo
export type UserRepository = UserRepo
