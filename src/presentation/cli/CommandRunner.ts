import { Type } from '@nestjs/common'
import { ModuleRef } from '@nestjs/core'
import { ConsoleApplication } from '@solid-soda/console'

export default class CommandRunner {
  private moduleRef: ModuleRef
  private application: ConsoleApplication

  public setModuleRef(ref: ModuleRef): void {
    this.moduleRef = ref
  }

  public register(commandFunctions: Array<Type<any>>): void {
    const commands = commandFunctions.map(voterFunction =>
      this.moduleRef.get(voterFunction),
    )

    this.application = new ConsoleApplication(commands)
  }

  public async run(args: string[]): Promise<void> {
    return this.application.run(args.slice(2))
  }
}
