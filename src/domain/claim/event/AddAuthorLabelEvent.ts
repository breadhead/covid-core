import Event from '@app/infrastructure/events/Event'
import Claim from '../Claim.entity'

export const NAME = 'claim/add-author-label'

interface AddAuthorLabel {
  claim: Claim
  author: string
}

export default class AddAuthorLabelEvent implements Event<AddAuthorLabel> {
  public readonly name = NAME

  public constructor(public readonly payload: AddAuthorLabel) {}
}
