import { AbstractRepository, EntityRepository } from 'typeorm'

import EntityNotFoundException from '../exception/EntityNotFoundException'
import Company from './Company.entity'

@EntityRepository(Company)
export default class CompanyRepository extends AbstractRepository<Company> {
  public findOne(name: string): Promise<Company | null> {
    return this.repository.findOne(name)
  }

  public async getOne(name: string): Promise<Company> {
    const company = await this.repository.findOne(name)

    if (!company) {
      throw new EntityNotFoundException(Company.name, { name })
    }

    return company
  }
}
