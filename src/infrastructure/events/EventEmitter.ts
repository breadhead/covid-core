import { Injectable, Type } from '@nestjs/common'
import { ModuleRef } from '@nestjs/core'
import * as NanoEvents from 'nanoevents'

import Event from './Event'
import EventSubscriber from './EventSubscriber'

@Injectable()
export default class EventEmitter {
  private readonly emitter: any
  private moduleRef: ModuleRef

  public constructor() {
    this.emitter = new NanoEvents()
  }

  public setModuleRef(ref: ModuleRef): void {
    this.moduleRef = ref
  }

  public register(subscriberFunctions: Array<Type<any>>) {
    subscriberFunctions
      .map((subcriberFunction) => this.moduleRef.get(subcriberFunction) as EventSubscriber)
      .map((subscriber) => subscriber.subscribedEvents())
      .reduce((cur, prev) => [...cur, ...prev], []) // flatten
      .forEach((handlerMap) => this.emitter.on(
        handlerMap.key,
        handlerMap.handler,
      ))
  }

  public emit<Payload = any>(event: Event<Payload>) {
    this.emitter.emit(event.name, event)
  }
}
