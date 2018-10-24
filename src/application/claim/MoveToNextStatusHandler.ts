import { CommandHandler } from '@breadhead/nest-throwable-bus'
import { ICommandHandler } from '@nestjs/cqrs'
import { InjectRepository } from '@nestjs/typeorm'

import ClaimRepository from '@app/domain/claim/ClaimRepository'
import StatusMover from '@app/domain/claim/StatusMover'

import MoveToNextStatusCommand from './MoveToNextStatusCommand'

@CommandHandler(MoveToNextStatusCommand)
export default class MoveToNextStatusHandler implements ICommandHandler<MoveToNextStatusCommand> {
  public constructor(
    @InjectRepository(ClaimRepository) private readonly claimRepo: ClaimRepository,
    private readonly statusMover: StatusMover,
  ) { }

  public async execute(command: MoveToNextStatusCommand, resolve: (value?) => void) {
    const { id } = command

    const claim = await this.claimRepo.getOne(id)

    await this.statusMover.next(claim)

    resolve()
  }
}
