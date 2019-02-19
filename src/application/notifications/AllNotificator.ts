import { Type } from '@nestjs/common'
import { ModuleRef } from '@nestjs/core'

import Claim from '@app/domain/claim/Claim.entity'
import Message from '@app/domain/claim/Message.entity'
import Feedback from '@app/domain/feedback/Feedback.entity'

import Notificator from './Notificator'

export default class AllNotificator implements Notificator {
  public static fromClasses(...classes: Array<Type<any>>): AllNotificator {
    return {} as any
  }

  private notificators: Notificator[]
  private moduleRef: ModuleRef

  public setModuleRef(ref: ModuleRef): void {
    this.moduleRef = ref
  }

  public register(notificatorFunctions: Array<Type<any>>): void {
    this.notificators = notificatorFunctions.map(
      notificatorFunction =>
        this.moduleRef.get(notificatorFunction) as Notificator,
    )
  }

  public async newChatMessageFromSpecialist(message: Message): Promise<void> {
    await this.forAll(notificator =>
      notificator.newChatMessageFromSpecialist(message),
    )
  }

  public async newChatMessageFromClient(message: Message): Promise<void> {
    await this.forAll(notificator =>
      notificator.newChatMessageFromClient(message),
    )
  }

  public async newFeedbackMessage(feedback: Feedback): Promise<void> {
    await this.forAll(notificator => notificator.newFeedbackMessage(feedback))
  }

  public async shortClaimApproved(claim: Claim): Promise<void> {
    await this.forAll(notificator => notificator.shortClaimApproved(claim))
  }

  public async shortClaimQueued(claim: Claim): Promise<void> {
    await this.forAll(notificator => notificator.shortClaimQueued(claim))
  }

  public async claimRejected(claim: Claim): Promise<void> {
    await this.forAll(notificator => notificator.claimRejected(claim))
  }

  public async doctorAnswer(claim: Claim): Promise<void> {
    await this.forAll(notificator => notificator.doctorAnswer(claim))
  }

  private async forAll(
    call: (notificator: Notificator) => Promise<void>,
  ): Promise<void> {
    await Promise.all(this.notificators.map(call))
  }
}
