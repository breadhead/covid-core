import { CommandHandler } from '@breadhead/nest-throwable-bus'
import { Inject } from '@nestjs/common'
import { ICommandHandler } from '@nestjs/cqrs'
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm'
import { EntityManager } from 'typeorm'

import ClaimRepository from '@app/domain/claim/ClaimRepository'
import DoctorChangedEvent from '@app/domain/claim/event/DoctorChangesEvent'
import UserRepository from '@app/domain/user/UserRepository'
import EventEmitter from '@app/infrastructure/events/EventEmitter'

import ChooseDoctorCommand from './ChooseDoctorCommand'

@CommandHandler(ChooseDoctorCommand)
export default class ChooseDoctorHandler
  implements ICommandHandler<ChooseDoctorCommand> {
  public constructor(
    @InjectRepository(ClaimRepository)
    private readonly claimRepo: ClaimRepository,
    @InjectRepository(UserRepository)
    private readonly userRepo: UserRepository,
    @InjectEntityManager()
    private readonly em: EntityManager,
    @Inject(EventEmitter)
    private readonly emitter: EventEmitter,
  ) {}

  public async execute(
    command: ChooseDoctorCommand,
    resolve: (value?) => void,
  ) {
    const { claimId, doctorLogin } = command

    const [claim, doctor] = await Promise.all([
      this.claimRepo.getOne(claimId),
      this.userRepo.getOne(doctorLogin),
    ])

    claim.attachDoctor(doctor)

    const editedClaim = await this.em.save(claim)

    this.emitter.emit(new DoctorChangedEvent(editedClaim))

    resolve()
  }
}
