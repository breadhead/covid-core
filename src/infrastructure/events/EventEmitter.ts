import { Injectable, Type } from '@nestjs/common'
import { ModuleRef } from '@nestjs/core'
import * as NanoEvents from 'nanoevents'

import Event from './Event'
import EventSubscriber from './EventSubscriber'

@Injectable()
export default class EventEmitter {
  private readonly emitter: any
  private moduleRef: ModuleRef

  private newHandlers = {}

  public constructor() {
    this.emitter = new NanoEvents()
  }

  public setModuleRef(ref: ModuleRef): void {
    this.moduleRef = ref
  }

  public register(subscriberFunctions: Array<Type<any>>) {
    subscriberFunctions
      .map(
        subcriberFunction =>
          this.moduleRef.get(subcriberFunction) as EventSubscriber,
      )
      .map(subscriber => subscriber.subscribedEvents())
      .reduce((cur, prev) => [...cur, ...prev], []) // flatten
      .forEach(handlerMap => {
        if (handlerMap.isNew) {
          this.newHandlers[handlerMap.key] = [
            ...(this.newHandlers[handlerMap.key] || []),
            handlerMap.handler,
          ]
        } else {
          this.emitter.on(handlerMap.key, handlerMap.handler)
        }
      })
  }

  public async emit<Payload = any>(event: Event<Payload>) {
    const newHandlers = this.newHandlers[event.name]

    if (newHandlers && newHandlers.length) {
      await Promise.all(newHandlers.map(handler => handler(event)))
    } else {
      this.emitter.emit(event.name, event)
    }
  }
}
