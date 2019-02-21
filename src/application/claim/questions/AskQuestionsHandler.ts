import { CommandHandler } from '@breadhead/nest-throwable-bus'
import { ICommandHandler } from '@nestjs/cqrs'
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm'
import { EntityManager } from 'typeorm'

import { ClaimStatus } from '@app/domain/claim/Claim.entity'
import ClaimRepository from '@app/domain/claim/ClaimRepository'
import StatusMover from '@app/domain/claim/StatusMover'
import Allocator from '@app/domain/quota/Allocator'

import AskQuestionsCommand from './AskQuestionsCommand'

@CommandHandler(AskQuestionsCommand)
export default class AskQuestionsHandler
  implements ICommandHandler<AskQuestionsCommand> {
  public constructor(
    @InjectRepository(ClaimRepository)
    private readonly claimRepo: ClaimRepository,
    @InjectEntityManager()
    private readonly em: EntityManager,
    private readonly statusMover: StatusMover,
  ) {}

  public async execute(
    command: AskQuestionsCommand,
    resolve: (value?) => void,
  ) {
    const { id, defaultQuestions, additionalQuestions } = command

    const claim = await this.claimRepo.getOne(id)

    const escapeQuestion = (question: string) => question.trim()

    const editedClaim = await this.em.transaction(async em => {
      claim.newQuestions(
        defaultQuestions.map(escapeQuestion),
        additionalQuestions.map(escapeQuestion),
      )

      if (claim.status !== ClaimStatus.QuestionnaireValidation) {
        await this.statusMover.next(claim)
      }

      return em.save(claim)
    })

    resolve(editedClaim)
  }
}
