import { CommandHandler } from '@breadhead/nest-throwable-bus'
import { ICommandHandler } from '@nestjs/cqrs'
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm'
import { None, Option, Some } from 'tsoption'
import { EntityManager } from 'typeorm'
import { matches } from 'z'

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
    const {
      name, constraints, corporate,
      publicCompany, comment,
    } = command

    const quota = await this.quotaRepo.getOne(command.id)

    await this.em.transaction((em) => {
      quota.editContent(name, constraints, corporate, publicCompany, comment)

      const company = this.ajustedCompany(quota, command)

      return em.save([
        company,
        quota,
      ])
    })

    resolve(quota)
  }

  private ajustedCompany(quota: Quota, command: EditQuotaCommand): Company | null {
    const { company } = quota
    const { companyName } = command

    return matches({
      companyExist: !!company,
      newNameExist: !!companyName,
      needNewCompany: company && company.name !== companyName,
    })(
      (_ = { companyExist: false, newNameExist: false }) => null,
      (_ = { companyExist: true, newNameExist: false })  => company,
      (_ = { needNewCompany: true })                     => this.attachNewCompany(quota, command),
      (_ = { needNewCompany: false })                    => this.editExistCompany(quota, command),
    )
  }

  private attachNewCompany(quota: Quota, command: EditQuotaCommand) {
    const { companyName, companyLink, companyLogoUrl } = command

    const newCompany = new Company(companyName, companyLogoUrl, companyLink)

    quota.changeCompany(newCompany)

    return newCompany
  }

  private editExistCompany(quota: Quota, command: EditQuotaCommand) {
    const { company } = quota
    const { companyLink, companyLogoUrl } = command

    company.changeSite(companyLink)
    company.changeLogo(companyLogoUrl)

    return company
  }
}
