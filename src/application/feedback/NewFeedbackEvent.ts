import Feedback from 'domain/feedback/Feedback.entity'
import Event from 'infrastructure/events/Event'

export const NAME = 'new-feedback'

export default class NewFeedbackEvent implements Event<Feedback> {
  public readonly name = NAME

  public constructor(
    public readonly payload: Feedback,
  ) { }
}
