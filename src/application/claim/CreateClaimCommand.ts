import { ICommand } from '@nestjs/cqrs'

import Gender from '@app/infrastructure/customTypes/Gender'

// TODO: add "Для кого это консультация, консультируемый — родственник, я, клиент"
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
  ) { }
}
