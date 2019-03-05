import { ICommand } from '@nestjs/cqrs'

export interface QuestionWithAnswer {
  question: string
  answer: string
}
