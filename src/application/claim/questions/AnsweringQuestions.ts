import { Injectable } from '@nestjs/common'
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm'
import { EntityManager } from 'typeorm'

import ClaimRepository from '@app/domain/claim/ClaimRepository'
import Question from '@app/domain/claim/Question.vo'
import StatusMover from '@app/domain/claim/StatusMover'

import { QuestionWithAnswer } from './dto/QuestionWithAnswer'

@Injectable()
export class AnsweringQuestions {
  public constructor(
    @InjectRepository(ClaimRepository)
    private readonly claimRepo: ClaimRepository,
    @InjectEntityManager()
    private readonly em: EntityManager,
    private readonly statusMover: StatusMover,
  ) {}

  public async answer(
    claimId: string,
    answers: QuestionWithAnswer[],
  ): Promise<void> {
    const claim = await this.claimRepo.getOne(claimId)

    claim.answerQuestions(
      answers.map(({ question, answer }) => new Question(question, answer)),
    )

    if (!!claim.answeredAt) {
      claim.setAnswerUpdatedAt = new Date()
    } else {
      claim.setAnsweredAt = new Date()
    }
    await this.statusMover.afterNewAnswers(claim)
    await this.em.save(claim)
  }
}
