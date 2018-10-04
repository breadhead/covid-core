import { CommandHandler, ICommand } from '@nestjs/cqrs'

import CommandBusResult from './CommandBusResult'

const makeExecuteThrowable = (execute) =>
  async function(command: ICommand, resolve: (value?) => void) {
    const originalMethod = execute.bind(this)

    let result
    const fakeResolve = (resultFromExecute) => {
      result = resultFromExecute
    }

    try {
      await originalMethod(command, fakeResolve)
      resolve(CommandBusResult.success(result))
    } catch (error) {
      resolve(CommandBusResult.failure(error))
    }
  }

export default (command: ICommand): ClassDecorator => (target: any) => {
  CommandHandler(command)(target)

  const newExecute = makeExecuteThrowable(target.prototype.execute)

  target.prototype.execute = newExecute
}
