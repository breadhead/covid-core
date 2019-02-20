import Claim from '@app/domain/claim/Claim.entity'
import Event from '@app/infrastructure/events/Event'

export const NAME = 'claim/close-without-answer'

export default class CloseWithoutAnswer implements Event<Claim> {
  public readonly name = NAME

  public constructor(public readonly payload: any) {}
}
