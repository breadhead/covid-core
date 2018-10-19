import { CommandHandler } from '@breadhead/nest-throwable-bus'
import { ICommandHandler } from '@nestjs/cqrs'
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm'
import { EntityManager } from 'typeorm'

import Company from '@app/domain/company/Company.entity'
import Quota from '@app/domain/quota/Quota.entity'
import QuotaRepository from '@app/domain/quota/QuotaRepository'

import EditQuotaCommand from './EditQuotaCommand'

@CommandHandler(EditQuotaCommand)
export default class EditQuotaHandler implements ICommandHandler<EditQuotaCommand> {
  public constructor(
    @InjectEntityManager() private readonly em: EntityManager,
    @InjectRepository(QuotaRepository) private readonly quotaRepo: QuotaRepository,
  ) { }

  public async execute(command: EditQuotaCommand, resolve: (value?) => void) {
    const quota = await this.quotaRepo.getOne(command.id)

    const {
      name, constraints, corporate,
      publicCompany, comment,
    } = command

    await this.em.transaction((em) => {
      quota.rename(name)
      quota.newConstraints(constraints)
      quota.adjustCorporate(corporate)
      quota.changeCompanyPublicity(!!publicCompany)
      quota.changeComment(comment || '')

      const company = this.editCompany(quota, command)

      return em.save([
        company,
        quota,
      ])
    })

    resolve(quota)
  }

  private editCompany(quota: Quota, command: EditQuotaCommand): Company | null {
    const { company } = quota
    const { companyName, companyLink, companyLogoUrl } = command

    if (!companyName && !company) {
      return null
    }

    if (!companyName && company) {
      return company
    }

    if (companyName !== company.name) {
      const newCompany = new Company(companyName, companyLogoUrl, companyLink)

      quota.changeCompany(newCompany)

      return newCompany
    }

    company.changeSite(companyLink)
    company.changeLogo(companyLogoUrl)

    return company
  }
}
