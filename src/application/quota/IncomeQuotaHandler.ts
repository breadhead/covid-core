import { CommandHandler } from '@breadhead/nest-throwable-bus'
import { ICommandHandler } from '@nestjs/cqrs'
import IncomeQuotaCommand from './IncomeQuotaCommand'

import CompanyRepository from '@app/domain/company/CompanyRepository'
import Accountant from '@app/domain/quota/Accountant'
import QuotaRepository from '@app/domain/quota/QuotaRepository'
import { InjectRepository } from '@nestjs/typeorm'

@CommandHandler(IncomeQuotaCommand)
export default class IncomeQuotaHandler implements ICommandHandler<IncomeQuotaCommand> {
  public constructor(
    @InjectRepository(QuotaRepository) private readonly quotaRepo: QuotaRepository,
    @InjectRepository(CompanyRepository) private readonly companyRepo: CompanyRepository,
    private readonly accountant: Accountant,
  ) { }

  public async execute(command: IncomeQuotaCommand, resolve: (value?) => void) {

    const quota = await this.quotaRepo.getOne(command.quotaId)

    await this.accountant.income(quota, command.amount)

    resolve(quota)
  }
}
