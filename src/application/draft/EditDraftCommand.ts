import { ICommand } from '@nestjs/cqrs'

export default class EditDraftCommand implements ICommand {
  public constructor(public readonly id: string, public readonly body: any) {}
}
