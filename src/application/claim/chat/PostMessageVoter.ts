import { Injectable } from '@nestjs/common'

import { ClaimRepository } from '@app/domain/claim/ClaimRepository'
import Attribute from '@app/infrastructure/security/SecurityVoter/Attribute'
import SecurityVoter from '@app/infrastructure/security/SecurityVoter/SecurityVoter'
import TokenPayload from '@app/infrastructure/security/TokenPayload'
import { UserRepository } from '@app/user/service/UserRepository'

import PostMessageCommand from './PostMessageCommand'

@Injectable()
export default class PostMessageVoter
  implements SecurityVoter<PostMessageCommand> {
  public constructor(
    private readonly userRepo: UserRepository,
    private readonly claimRepo: ClaimRepository,
  ) {}

  public supports(attribute: Attribute, subject) {
    return (
      attribute === Attribute.Create && subject instanceof PostMessageCommand
    )
  }

  public async voteOnAttribute(
    _: Attribute,
    { claimId }: PostMessageCommand,
    { login }: TokenPayload,
  ): Promise<boolean> {
    const [user, claim] = await Promise.all([
      this.userRepo.getOne(login),
      this.claimRepo.getOne(claimId),
    ])

    if (user.isClient) {
      return user.login === claim.author.login
    }

    return true
  }
}
