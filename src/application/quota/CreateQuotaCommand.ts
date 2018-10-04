import { ICommand } from '@nestjs/cqrs'

export default class CreateQuotaCommand implements ICommand {
  public constructor(
    public readonly name: string,
    public readonly balance: number,
    public readonly companyId?: string,
  ) {}
}
