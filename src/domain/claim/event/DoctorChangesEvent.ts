import Claim from '@app/domain/claim/Claim.entity'
import Event from '@app/infrastructure/events/Event'

export const NAME = 'claim/doctor-changed-event'

export default class DoctorChangedEvent implements Event<Claim> {
  public readonly name = NAME

  public constructor(public readonly payload: Claim) {}
}
