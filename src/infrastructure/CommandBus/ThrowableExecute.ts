import { ICommand } from '@nestjs/cqrs'

import CommandBusResult from './CommandBusResult'

export default (): MethodDecorator => <T>(_1, _2, descriptor: TypedPropertyDescriptor<T>) => ({
  value: (async function(command: ICommand, resolve: (value?) => void) {
    const originalMethod = (descriptor.value as any).bind(this)

    let result
    const fakeResolve = (resultFromExecute) => {
      result = resultFromExecute
    }

    let resolved

    try {
      await originalMethod(command, fakeResolve)
      resolved = CommandBusResult.success(result)
    } catch (error) {
      resolved = CommandBusResult.failure(error)
    }

    resolve(resolved)
  }) as any,
})
