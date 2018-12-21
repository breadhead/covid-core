import { ICommand } from '@nestjs/cqrs'

import { ClaimTarget } from '@app/domain/claim/Claim.entity'
import Gender from '@app/infrastructure/customTypes/Gender'

export default class CreateClaimCommand implements ICommand {
  public constructor(
    public readonly userLogin: string,
    public readonly theme: string,
    public readonly name: string,
    public readonly age: number,
    public readonly gender: Gender,
    public readonly region: string,
    public readonly diagnosis?: string,
    public readonly email?: string,
    public readonly phone?: string,
    public readonly company?: string,
    public readonly position?: string,
    public readonly target: ClaimTarget = ClaimTarget.Self,
  ) {}
}
