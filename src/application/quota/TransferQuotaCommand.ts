import { ICommand } from '@nestjs/cqrs'

export default class TransferQuotaCommand implements ICommand {
  public constructor(
    public readonly sourceId: string,
    public readonly targetId: string,
    public readonly count: number,
  ) {}
}
