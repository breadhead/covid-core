import Claim from '@app/domain/claim/Claim.entity'
import Event from '@app/infrastructure/events/Event'

export const NAME = 'claim/claim-requires-waiting'

export default class ClaimRequiresWaiting implements Event<Claim> {
  public readonly name = NAME

  public constructor(public readonly payload: Claim) {}
}
