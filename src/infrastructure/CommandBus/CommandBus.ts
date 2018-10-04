import { Injectable } from '@nestjs/common'
import { CommandBus as OriginalCommandBus } from '@nestjs/cqrs'

import CommandBusResult from './CommandBusResult'

@Injectable()
export default class CommandBus extends OriginalCommandBus {
  public async execute(command): Promise<any> {
    const resolved = await super.execute(command)

    if (resolved instanceof CommandBusResult) {
      const { error, result } = resolved

      if (error) {
        throw error
      }

      return result
    }
  }
}
