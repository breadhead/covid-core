import { CommandHandler } from '@breadhead/nest-throwable-bus'
import { ICommandHandler } from '@nestjs/cqrs'
import { InjectRepository } from '@nestjs/typeorm'

import ClaimRepository from '@app/domain/claim/ClaimRepository'

import EditSituationCommand from './EditSituationCommand'

@CommandHandler(EditSituationCommand)
export default class EditSituationHandler
  implements ICommandHandler<EditSituationCommand> {
  public constructor(
    @InjectRepository(ClaimRepository)
    private readonly claimRepo: ClaimRepository,
  ) {}

  public async execute(
    command: EditSituationCommand,
    resolve: (value?) => void,
  ) {
    const { id } = command

    const claim = await this.claimRepo.getOne(id)

    resolve(claim)
  }
}
