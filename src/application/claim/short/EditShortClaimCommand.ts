import { ICommand } from '@nestjs/cqrs'

import { ClaimTarget } from '@app/domain/claim/Claim.entity'
import Gender from '@app/infrastructure/customTypes/Gender'

import BaseShortClaimCommand from './BaseShortClaimCommand'

export default class EditShortClaimCommand extends BaseShortClaimCommand
  implements ICommand {
  public constructor(
    public readonly id: string,
    userLogin: string,
    theme: string,
    name: string,
    age: number,
    gender: Gender,
    region: string,
    localization?: string,
    email?: string,
    phone?: string,
    company?: string,
    position?: string,
    target: ClaimTarget = ClaimTarget.Self,
  ) {
    super(
      userLogin,
      theme,
      name,
      age,
      gender,
      region,
      localization,
      email,
      phone,
      company,
      position,
      target,
    )
  }
}
