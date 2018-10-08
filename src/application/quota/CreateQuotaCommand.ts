import { ICommand } from '@nestjs/cqrs'

export default class CreateQuotaCommand implements ICommand {
  public constructor(
    public readonly name: string,
    public readonly balance: number,
    public readonly constraints: string[],
    public readonly corporate: boolean,
    public readonly companyName?: string,
  ) {}
}
