import Event from '@app/infrastructure/events/Event'
import Claim from 'domain/claim/Claim.entity'

export const NAME = 'claim/doctor-answer-event'

export default class DoctorAnswerEvent implements Event<Claim> {
  public readonly name = NAME

  public constructor(
    public readonly payload: Claim,
  ) { }
}
