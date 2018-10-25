import NewMessageEvent, { NAME as NewMessageName } from '@app/domain/claim/event/NewMessageEvent'
import EventSubscriber from '@app/infrastructure/events/EventSubscriber'

export default class BoardSubscriber implements EventSubscriber {
  public subscribedEvents() {
    return [
      { key: NewMessageName, handler: this.addLabelNewMessage.bind(this) },
    ]
  }

  private async addLabelNewMessage({ payload }: NewMessageEvent) {
    // TODO: Added call board manager to add label for claim
    console.log('LABEL ADDED') // tslint:disable-line
  }
}
