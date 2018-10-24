import { ICommand } from '@nestjs/cqrs'

export default class MoveToNextStatusCommand implements ICommand {
  public constructor(
    public readonly id: string,
  ) { }
}
