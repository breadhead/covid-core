import { ICommand } from '@nestjs/cqrs'

export default class CreateDraftCommand implements ICommand {
  public constructor(
    public readonly userLogin: string,
    public readonly body: any,
  ) {}
}
