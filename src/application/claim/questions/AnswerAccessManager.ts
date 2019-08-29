import { Injectable } from '@nestjs/common'

import Claim, { ClaimStatus } from '@app/domain/claim/Claim.entity'
import { UserRepository } from '@app/user/service/UserRepository'

@Injectable()
export default class AnswerAccessManager {
  private statusesWhenCllientHaveAccess = [
    ClaimStatus.DeliveredToCustomer,
    ClaimStatus.ClosedSuccessfully,
  ]

  public constructor(private readonly userRepo: UserRepository) {}

  public async accessIsGranted(login: string, claim: Claim): Promise<boolean> {
    const user = await this.userRepo.getOne(login)

    if (user.isOnlyClient) {
      return this.statusesWhenCllientHaveAccess.includes(claim.status)
    }

    return true
  }
}
