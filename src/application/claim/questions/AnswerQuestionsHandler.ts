import { CommandHandler } from '@breadhead/nest-throwable-bus'
import { ICommandHandler } from '@nestjs/cqrs'
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm'
import { EntityManager } from 'typeorm'

import { ClaimStatus } from '@app/domain/claim/Claim.entity'
import ClaimRepository from '@app/domain/claim/ClaimRepository'
import Question from '@app/domain/claim/Question.vo'
import StatusMover from '@app/domain/claim/StatusMover'

import AnswerQuestionsCommand from './AnswerQuestionsCommand'

@CommandHandler(AnswerQuestionsCommand)
export default class AnswerQuestionsHandler
  implements ICommandHandler<AnswerQuestionsCommand> {
  public constructor(
    @InjectRepository(ClaimRepository)
    private readonly claimRepo: ClaimRepository,
    @InjectEntityManager()
    private readonly em: EntityManager,
    private readonly statusMover: StatusMover,
  ) {}

  public async execute(
    command: AnswerQuestionsCommand,
    resolve: (value?) => void,
  ) {
    const { id, answers } = command

    const claim = await this.claimRepo.getOne(id)

    const editedClaim = await this.em.transaction(async em => {
      const answeredQuestions = answers.map(
        ({ question, answer }) => new Question(question, answer),
      )

      claim.answerQuestions(answeredQuestions)

      if (claim.status !== ClaimStatus.AnswerValidation) {
        await this.statusMover.next(claim)
      }

      return em.save(claim)
    })

    resolve(editedClaim)
  }
}
