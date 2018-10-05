import { ICommand } from '@nestjs/cqrs'

export default class RenameQuotaCommand implements ICommand {
  public constructor(
    public readonly id: string,
    public readonly newName: string,
  ) {}
}
