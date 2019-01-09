import { ICommand } from '@nestjs/cqrs'

export default class IncomeQuotaCommand implements ICommand {
  public constructor(
    public readonly amount: number,
    public readonly quotaId: string,
  ) {}
}
