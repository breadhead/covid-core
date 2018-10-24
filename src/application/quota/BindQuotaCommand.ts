import { ICommand } from '@nestjs/cqrs'

export default class BindQuotaCommand implements ICommand {
  public constructor(
    public readonly quotaId: string,
    public readonly claimId: string,
  ) { }
}
