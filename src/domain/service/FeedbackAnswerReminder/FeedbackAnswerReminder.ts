import ClaimRepository from '@app/domain/claim/ClaimRepository'
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm'
import { EntityManager, Repository } from 'typeorm'

export default class FeedbackReminder {
  public constructor(
    @InjectEntityManager() private readonly em: EntityManager,
    @InjectRepository(ClaimRepository)
    private readonly claimRepo: ClaimRepository,
  ) {}
}
