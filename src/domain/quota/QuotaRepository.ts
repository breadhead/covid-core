import { AbstractRepository, EntityRepository } from 'typeorm'

import EntityNotFoundException from '../exception/EntityNotFoundException'
import Quota, { QuotaType } from './Quota.entity'
import { CommonLocalizationsEnum } from '../claim/CommonLocalizationsEnum'

@EntityRepository(Quota)
export default class QuotaRepository extends AbstractRepository<Quota> {
  public findAll() {
    return this.repository.find()
  }

  public async getOne(id: string): Promise<Quota> {
    const quota = await this.repository.findOne(id)

    if (!quota) {
      throw new EntityNotFoundException(Quota.name, { id })
    }

    return quota
  }

  public findOneByName(name: string): Promise<Quota | null> {
    return this.repository.findOne({
      where: { name },
    })
  }

  public findCorporateByCompanyName(
    companyName: string,
  ): Promise<Quota[] | null> {
    return this.repository
      .createQueryBuilder('quota')
      .where('quota.CompanyName like :companyName', {
        companyName,
      })
      .andWhere('quota._corporate > 0')
      .andWhere('quota._balance > 0')
      .getMany()
  }

  public findCommon(): Promise<Quota[]> {
    return this.findByType(QuotaType.Common)
  }

  public findCommonAvailable(): Promise<Quota[]> {
    return this.findCommon().then(quotas =>
      quotas.filter(quota => quota.balance),
    )
  }

  public findByLocalization(
    localization: CommonLocalizationsEnum,
  ): Promise<Quota[]> {
    return this.repository
      .createQueryBuilder('quota')
      .where('quota._constraints like :localization', {
        localization: `%${localization}%`,
      })
      .andWhere('quota._balance > 0')
      .getMany()
  }

  private async findByType(type: QuotaType): Promise<Quota[]> {
    const allQuotas = await this.findAll()

    return allQuotas.filter(quota => quota.type === type)
  }
}
