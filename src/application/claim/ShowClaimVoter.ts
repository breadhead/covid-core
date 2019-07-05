import { Injectable } from '@nestjs/common'

import Claim from '@app/domain/claim/Claim.entity'
import Attribute from '@app/infrastructure/security/SecurityVoter/Attribute'
import SecurityVoter from '@app/infrastructure/security/SecurityVoter/SecurityVoter'
import TokenPayload from '@app/infrastructure/security/TokenPayload'
import { UserRepository } from '@app/user/service/UserRepository'

@Injectable()
export default class ShowClaimVoter implements SecurityVoter<Claim> {
  public constructor(private readonly userRepo: UserRepository) {}

  public supports(attribute: Attribute, subject) {
    return attribute === Attribute.Show && subject instanceof Claim
  }

  public async voteOnAttribute(
    _: Attribute,
    claim: Claim,
    { login }: TokenPayload,
  ): Promise<boolean> {
    const user = await this.userRepo.getOne(login)

    if (user.isClient) {
      return user.login === claim.author.login
    }

    return true
  }
}
