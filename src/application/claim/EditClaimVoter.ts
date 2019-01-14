import { InjectRepository } from '@nestjs/typeorm'

import Claim, { ClaimStatus } from '@app/domain/claim/Claim.entity'
import UserRepository from '@app/domain/user/UserRepository'
import Attribute from '@app/infrastructure/security/SecurityVoter/Attribute'
import SecurityVoter from '@app/infrastructure/security/SecurityVoter/SecurityVoter'
import TokenPayload from '@app/infrastructure/security/TokenPayload'

export default class EditClaimVoter implements SecurityVoter<Claim> {
  private readonly statusesForEditingByClient = [
    ClaimStatus.New,
    ClaimStatus.QuestionnaireWaiting,
  ]

  public constructor(
    @InjectRepository(UserRepository) private readonly userRepo: UserRepository,
  ) {}

  public supports(attribute: Attribute, subject) {
    return attribute === Attribute.Edit && subject instanceof Claim
  }

  public async voteOnAttribute(
    _: Attribute,
    claim: Claim,
    { login }: TokenPayload,
  ): Promise<boolean> {
    const user = await this.userRepo.getOne(login)

    if (user.isClient) {
      const isAuthor = user.login === claim.author.login
      const editingAllowed = this.statusesForEditingByClient.includes(
        claim.status,
      )
      return isAuthor && editingAllowed
    }

    return true
  }
}
