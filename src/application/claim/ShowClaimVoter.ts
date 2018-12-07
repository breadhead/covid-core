import { InjectRepository } from '@nestjs/typeorm'

import Claim from '@app/domain/claim/Claim.entity'
import UserRepository from '@app/domain/user/UserRepository'
import Attribute from '@app/infrastructure/security/SecurityVoter/Attribute'
import SecurityVoter from '@app/infrastructure/security/SecurityVoter/SecurityVoter'
import TokenPayload from '@app/infrastructure/security/TokenPayload'

export default class ShowClaimVoter implements SecurityVoter<Claim> {
  public constructor(
    @InjectRepository(UserRepository) private readonly userRepo: UserRepository,
  ) {}

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
