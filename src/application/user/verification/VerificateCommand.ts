import { ICommand } from '@nestjs/cqrs'

export default class VerificateCommand implements ICommand {
  public constructor(
    public readonly login: string,
    public readonly code: string,
  ) {}
}
