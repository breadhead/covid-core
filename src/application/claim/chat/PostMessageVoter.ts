import { InjectRepository } from '@nestjs/typeorm'

import ClaimRepository from '@app/domain/claim/ClaimRepository'
import UserRepository from '@app/domain/user/UserRepository'
import Attribute from '@app/infrastructure/security/SecurityVoter/Attribute'
import SecurityVoter from '@app/infrastructure/security/SecurityVoter/SecurityVoter'
import TokenPayload from '@app/infrastructure/security/TokenPayload'

import PostMessageCommand from './PostMessageCommand'

export default class PostMessageVoter implements SecurityVoter<PostMessageCommand> {
  public constructor(
    @InjectRepository(UserRepository) private readonly userRepo: UserRepository,
    @InjectRepository(ClaimRepository) private readonly claimRepo: ClaimRepository,
  ) {}

  public supports(attribute: Attribute, subject) {
    return attribute === Attribute.Create && subject instanceof PostMessageCommand
  }

  public async voteOnAttribute(
    _: Attribute,
    { claimId }: PostMessageCommand,
    { login }: TokenPayload,
  ): Promise<boolean> {
    const [ user, claim ] = await Promise.all([
      this.userRepo.getOne(login),
      this.claimRepo.getOne(claimId),
    ])

    if (user.isClient) {
      return user.login === claim.author.login
    }

    return true
  }
}
