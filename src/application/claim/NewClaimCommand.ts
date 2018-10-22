import { ICommand } from '@nestjs/cqrs'

export default class NewClaimCommand implements ICommand {
  public constructor() {
    // pass
  }
}
