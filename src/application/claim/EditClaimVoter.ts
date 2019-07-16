import Claim, { ClaimStatus } from '@app/domain/claim/Claim.entity'
import Attribute from '@app/infrastructure/security/SecurityVoter/Attribute'
import SecurityVoter from '@app/infrastructure/security/SecurityVoter/SecurityVoter'
import TokenPayload from '@app/infrastructure/security/TokenPayload'
import { UserRepository } from '@app/user/service/UserRepository'
import { Injectable } from '@nestjs/common'

@Injectable()
export default class EditClaimVoter implements SecurityVoter<Claim> {
  private readonly statusesForEditingByClient = [
    ClaimStatus.New,
    ClaimStatus.QuestionnaireWaiting,
  ]

  public constructor(private readonly userRepo: UserRepository) {}

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
