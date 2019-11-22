import { ClaimTarget } from '@app/domain/claim/Claim.entity'
import Gender from '@app/infrastructure/customTypes/Gender'
import { ICommand } from '@nestjs/cqrs'

export default class BaseShortClaimCommand implements ICommand {
  public constructor(
    public readonly userLogin: string,
    public readonly theme: string,
    public readonly name: string,
    public readonly age: number,
    public readonly gender: Gender,
    public readonly region: string,
    public readonly localization?: string,
    public readonly email?: string,
    public readonly phone?: string,
    public readonly company?: string,
    public readonly position?: string,
    public readonly target: ClaimTarget = ClaimTarget.Self,
  ) {}
}
