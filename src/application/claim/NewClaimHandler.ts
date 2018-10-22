import { CommandHandler } from '@breadhead/nest-throwable-bus'
import { ICommandHandler } from '@nestjs/cqrs'

import StatusMover from '@app/domain/claim/StatusMover'

import NewClaimCommand from './NewClaimCommand'

@CommandHandler(NewClaimCommand)
export default class NewClaimHandler implements ICommandHandler<NewClaimCommand> {
  public constructor(
    private readonly statusMover: StatusMover,
  ) {
    // pass
  }

  public async execute(command: NewClaimCommand, resolve: (value?) => void) {
    console.log(this.statusMover) // tslint:disable-line

    resolve()
  }
}
