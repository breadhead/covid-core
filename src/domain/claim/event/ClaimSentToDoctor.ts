import Claim from '@app/domain/claim/Claim.entity'
import Event from '@app/infrastructure/events/Event'

export const NAME = 'claim/claim-sent-to-doctor'

export default class ClaimSentToDoctor implements Event<Claim> {
  public readonly name = NAME

  public constructor(public readonly payload: Claim) {}
}
