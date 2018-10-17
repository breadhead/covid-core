import Event from './Event'

interface EventHandler<Payload = any> {
  readonly key: string
  readonly handler: (event: Event<Payload>) => Promise<void>
}

export default interface EventSubscriber {
  subscribedEvents(): EventHandler[]
}
