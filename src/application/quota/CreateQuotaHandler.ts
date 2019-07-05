import { CommandHandler } from '@breadhead/nest-throwable-bus'
import { ICommandHandler } from '@nestjs/cqrs'
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm'
import { EntityManager } from 'typeorm'

import Company from '@app/domain/company/Company.entity'
import CompanyRepository from '@app/domain/company/CompanyRepository'
import Accountant from '@app/domain/quota/Accountant'
import Quota from '@app/domain/quota/Quota.entity'
import { IdGenerator } from '@app/utils/service/IdGenerator/IdGenerator'

import CreateQuotaCommand from './CreateQuotaCommand'

@CommandHandler(CreateQuotaCommand)
export default class CreateQuotaHandler
  implements ICommandHandler<CreateQuotaCommand> {
  public constructor(
    @InjectEntityManager() private readonly em: EntityManager,
    private readonly idGenerator: IdGenerator,
    @InjectRepository(CompanyRepository)
    private readonly companyRepo: CompanyRepository,
    private readonly accountant: Accountant,
  ) {}

  public async execute(command: CreateQuotaCommand, resolve: (value?) => void) {
    const {
      name,
      constraints,
      corporate,
      balance,
      companyName,
      companyLogoUrl,
      companyLink,
      publicCompany,
      companyComment,
      comment,
    } = command

    const id = this.idGenerator.get()

    const company = companyName
      ? await this.getOrCreateCompany(
          companyName,
          companyLogoUrl,
          companyLink,
          companyComment,
        )
      : undefined

    const quota = new Quota(
      id,
      name,
      constraints,
      company,
      corporate,
      publicCompany,
      comment,
    )
    await this.em.save(quota)

    await this.accountant.income(quota, balance)

    resolve(quota)
  }

  private async getOrCreateCompany(
    name: string,
    logoUrl?: string,
    companyLink?: string,
    companyComment?: string,
  ): Promise<Company> {
    let company = await this.companyRepo.findOne(name)

    if (!company) {
      company = await this.em.save(
        new Company(name, logoUrl, companyLink, companyComment),
      )
    }

    return company
  }
}
