import { Injectable } from '@nestjs/common'
import { CommandBus as OriginalCommandBus } from '@nestjs/cqrs'

import CommandBusResult from './CommandBusResult'

@Injectable()
export default class CommandBus extends OriginalCommandBus {
  public async execute(command): Promise<any> {
    const resolved = await super.execute(command)

    if (!(resolved instanceof CommandBusResult)) {
      return resolved
    }

    if (resolved.error) {
      throw resolved.error
    }

    return resolved.result
  }
}
