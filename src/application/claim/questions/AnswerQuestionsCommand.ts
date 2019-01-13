import { ICommand } from '@nestjs/cqrs'

interface QuestionWithAnswer {
  question: string
  answer: string
}

export default class AnswerQuestionsCommand implements ICommand {
  public constructor(
    public readonly id: string,
    public readonly answers: QuestionWithAnswer[] = [],
  ) {}
}
