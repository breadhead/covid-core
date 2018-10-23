import { ICommand } from '@nestjs/cqrs'

export default class PostFeedbackCommand implements ICommand {
  public constructor(
    public readonly name: string,
    public readonly content: string,
    public readonly email?: string,
    public readonly phone?: string,
    public readonly theme?: string,
  ) { }
}
