import { Inject, Type } from '@nestjs/common'
import { ModuleRef } from '@nestjs/core'

import Configuration from '@app/infrastructure/Configuration/Configuration'

import TokenPayload from '../TokenPayload'
import Attribute from './Attribute'
import NoVotersException from './NoVotersException'
import SecurityVoter from './SecurityVoter'
import affirmativeStrategy from './strategy/affirmativeStrategy'
import consensusStrategy from './strategy/consensusStrategy'
import Strategy, { StrategyType } from './strategy/strategy'
import unanimousStrategy from './strategy/unanimousStrategy'
import VotingFailedException from './VotingFailedException'

const STRATEGY_MAP = {
  [Strategy.Affirmative]: affirmativeStrategy,
  [Strategy.Consensus]: consensusStrategy,
  [Strategy.Unanimous]: unanimousStrategy,
}

export default class SecurityVotersUnity {
  private voters: SecurityVoter[] = []
  private moduleRef: ModuleRef

  public constructor(
    @Inject(Configuration) private readonly config: Configuration,
  ) { }

  public setModuleRef(ref: ModuleRef): void {
    this.moduleRef = ref
  }

  public register(voterFunctions: Array<Type<any>>): void {
    this.voters = voterFunctions
      .map((voterFunction) => this.moduleRef.get(voterFunction))
  }

  public async denyAccessUnlessGranted<Subject = any>(
    attribute: Attribute,
    subject: Subject,
    token: TokenPayload,
  ): Promise<void> {
    const votes = await Promise.all(
      this.voters
        .filter((voter) => voter.supports(attribute, subject))
        .map((voter) => voter.voteOnAttribute(attribute, subject, token)),
    )

    if (!this.legitimacy(votes)) {
      throw new NoVotersException(token)
    }

    if (!this.votesResult(votes)) {
      throw new VotingFailedException(token)
    }
  }

  private legitimacy(votes: boolean[]): boolean {
    const allowIfAllAbstain = this.config
      .get('SECURITY_ALLOW_IF_ALL_ABSTAIN')
      .map(parseInt)
      .map(Boolean)
      .getOrElse(false)

    return (votes.length !== 0 || allowIfAllAbstain)
  }

  private votesResult(votes: boolean[]): boolean {
    const strategy: StrategyType = this.config
      .get('SECURITY_STRATEGY')
      .map((str) => str as Strategy)
      .map((str) => STRATEGY_MAP[str])
      .getOrElse(unanimousStrategy)

    return strategy(votes)
  }
}
