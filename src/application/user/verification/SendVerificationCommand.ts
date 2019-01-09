import { ICommand } from '@nestjs/cqrs'

export default class SendVerificationCommand implements ICommand {
  public constructor(
    public readonly number: string,
    public readonly login: string,
  ) {}
}
