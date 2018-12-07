import Feedback from '@app/domain/feedback/Feedback.entity'
import Event from '@app/infrastructure/events/Event'

export const NAME = 'new-feedback'

export default class NewFeedbackEvent implements Event<Feedback> {
  public readonly name = NAME

  public constructor(public readonly payload: Feedback) {}
}
