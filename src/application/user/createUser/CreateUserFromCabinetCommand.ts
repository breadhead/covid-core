import { ICommand } from '@nestjs/cqrs'

export default class CreateUserFromCabinetCommand implements ICommand {
  public constructor(public readonly id: number) {}
}
