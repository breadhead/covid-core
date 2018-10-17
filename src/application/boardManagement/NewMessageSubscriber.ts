import EventSubscriber from '@app/infrastructure/events/EventSubscriber'

import NewMessageEvent, { NAME } from '../claim/NewMessageEvent'

export default class NewMessageSubscriber implements EventSubscriber {
  public subscribedEvents() {
    return [
      {
        key: NAME,
        handler: this.invoke.bind(this),
      },
    ]
  }

  private async invoke({ payload, ...event }: NewMessageEvent) {
    // TODO: Added call board manager to add label for claim
    console.log('LABEL ADDED') // tslint:disable-line
  }
}
