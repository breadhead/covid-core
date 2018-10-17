import Message from '@app/domain/claim/Message.entity'
import Event from '@app/infrastructure/events/Event'

export const NAME = 'claim/new-message'

export default class NewMessageEvent implements Event<Message> {
  public readonly name = NAME

  public constructor(
    public readonly payload: Message,
  ) { }
}
