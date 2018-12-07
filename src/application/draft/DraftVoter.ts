import { InjectRepository } from '@nestjs/typeorm'

import Draft from '@app/domain/draft/Draft.entity'
import UserRepository from '@app/domain/user/UserRepository'
import Attribute from '@app/infrastructure/security/SecurityVoter/Attribute'
import SecurityVoter from '@app/infrastructure/security/SecurityVoter/SecurityVoter'
import TokenPayload from '@app/infrastructure/security/TokenPayload'

export default class DraftVoter implements SecurityVoter<Draft> {
  public constructor(
    @InjectRepository(UserRepository) private readonly userRepo: UserRepository,
  ) {}

  public supports(attribute: Attribute, subject) {
    const acceptedAttributes = [Attribute.Show, Attribute.Edit]

    return acceptedAttributes.includes(attribute) && subject instanceof Draft
  }

  public async voteOnAttribute(
    _: Attribute,
    draft: Draft,
    { login }: TokenPayload,
  ): Promise<boolean> {
    const user = await this.userRepo.getOne(login)

    return user.login === draft.author.login
  }
}
