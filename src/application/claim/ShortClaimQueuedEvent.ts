import Event from '@app/infrastructure/events/Event'
import Claim from 'domain/claim/Claim.entity'

export const NAME = 'claim/new-short-queued-event'

export default class ShortClaimQueuedEvent implements Event<Claim> {
  public readonly name = NAME

  public constructor(
    public readonly payload: Claim,
  ) { }
}
