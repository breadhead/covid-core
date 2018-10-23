import { ICommand } from '@nestjs/cqrs'

import Gender from '@app/infrastructure/customTypes/Gender'

export default class NewClaimCommand implements ICommand {
  public constructor(
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
  ) { }
}
