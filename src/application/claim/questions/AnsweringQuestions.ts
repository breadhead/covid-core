import { Injectable } from '@nestjs/common'
import { InjectEntityManager } from '@nestjs/typeorm'
import { EntityManager } from 'typeorm'

import { ClaimRepository } from '@app/domain/claim/ClaimRepository'
import Question from '@app/domain/claim/Question.vo'
import StatusMover from '@app/domain/claim/StatusMover'

import { QuestionWithAnswer } from './dto/QuestionWithAnswer'

@Injectable()
export class AnsweringQuestions {
  public constructor(
    private readonly claimRepo: ClaimRepository,
    @InjectEntityManager()
    private readonly em: EntityManager,
    private readonly statusMover: StatusMover,
  ) {}

  async preAnswer(
    claimId: string,
    answers: QuestionWithAnswer[],
  ): Promise<void> {
    const claim = await this.editAnswers(claimId, answers)

    claim.updateDraftedAt()

    await this.em.save(claim)
  }

  async answer(claimId: string, answers: QuestionWithAnswer[]): Promise<void> {
    const claim = await this.editAnswers(claimId, answers)

    if (!!claim.answeredAt) {
      claim.updateAnswerUpdatedAt()
    } else {
      claim.updateAnsweredAt()
    }

    await this.statusMover.afterNewAnswers(claim)
    await this.em.save(claim)
  }

  private editAnswers = async (
    claimId: string,
    answers: QuestionWithAnswer[],
  ) => {
    const claim = await this.claimRepo.getOne(claimId)

    claim.answerQuestions(
      answers.map(({ question, answer }) => new Question(question, answer)),
    )

    return claim
  }
}
