import { InjectRepository } from '@nestjs/typeorm'

import ClaimRepository from '@app/domain/claim/ClaimRepository'
import Message from '@app/domain/claim/Message.entity'
import UserRepository from '@app/domain/user/UserRepository'
import Attribute from '@app/infrastructure/security/SecurityVoter/Attribute'
import SecurityVoter from '@app/infrastructure/security/SecurityVoter/SecurityVoter'
import TokenPayload from '@app/infrastructure/security/TokenPayload'

export default class ShowChatVoter implements SecurityVoter<Message[]> {
  public constructor(
    @InjectRepository(UserRepository) private readonly userRepo: UserRepository,
    @InjectRepository(ClaimRepository) private readonly claimRepo: ClaimRepository,
  ) {}

  public supports(attribute: Attribute, subject) {
    return attribute === Attribute.Show &&
      (subject as any[]).every((s) => s instanceof Message)
  }

  public async voteOnAttribute(_: Attribute, messages: Message[], { login }: TokenPayload): Promise<boolean> {
    const user = await this.userRepo.getOne(login)

    if (user.isClient) {
      return messages.every((message) => message.user.login === user.login)
    }

    return true
  }
}
