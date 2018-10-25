import NewMessageEvent, { NAME } from '@app/domain/claim/event/NewMessageEvent'
import EventSubscriber from '@app/infrastructure/events/EventSubscriber'

export default class NewMessageSubscriber implements EventSubscriber {
  public subscribedEvents() {
    return [
      { key: NAME, handler: this.addLabelOnBoard.bind(this) },
    ]
  }

  private async addLabelOnBoard({ payload }: NewMessageEvent) {
    // TODO: Added call board manager to add label for claim
    console.log('LABEL ADDED') // tslint:disable-line
  }
}
