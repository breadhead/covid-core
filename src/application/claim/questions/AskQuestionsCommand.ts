import { ICommand } from '@nestjs/cqrs'

export default class AskQuestionsCommand implements ICommand {
  public constructor(
    public readonly id: string,
    public readonly defaultQuestions: string[] = [],
    public readonly additionalQuestions: string[] = [],
  ) {}
}
