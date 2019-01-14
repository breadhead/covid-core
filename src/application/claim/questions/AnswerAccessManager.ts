import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'

import Claim, { ClaimStatus } from '@app/domain/claim/Claim.entity'
import UserRepository from '@app/domain/user/UserRepository'

@Injectable()
export default class AnswerAccessManager {
  public constructor(
    @InjectRepository(UserRepository) private readonly userRepo: UserRepository,
  ) {}

  public async accessIsGranted(login: string, claim: Claim): Promise<boolean> {
    const user = await this.userRepo.getOne(login)

    if (user.isClient) {
      return claim.status === ClaimStatus.DeliveredToCustomer
    }

    return true
  }
}
