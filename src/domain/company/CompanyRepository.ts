import { AbstractRepository, EntityRepository } from 'typeorm'

import Company from './Company.entity'

@EntityRepository(Company)
export default class CompanyRepository extends AbstractRepository<Company> {
  public findOne(name: string): Promise<Company | null> {
    return this.repository.findOne(name)
  }
}
