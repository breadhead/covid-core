import { Logger } from '@nestjs/common'

export default class NullLoggerForCli extends Logger {
  public log(message: any, context?: string): void {
    // pass
  }

  public error(message: any, trace?: string, context?: string): void {
    // pass
  }

  public warn(message: any, context?: string): void {
    // pass
  }
}
