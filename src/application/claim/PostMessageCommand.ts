import { ICommand } from '@nestjs/cqrs'

export default class PostMessageCommand implements ICommand {
  public constructor(
    public readonly id: string,
    public readonly date: Date,
    public readonly content: string,
    public readonly claimId: string,
    public readonly userId: string,
  ) { }
}
