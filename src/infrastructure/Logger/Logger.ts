import { LoggerService } from '@nestjs/common'
import Monitor from './Monitor/Monitor'

export default abstract class Logger implements LoggerService {
  public constructor(private readonly monitor: Monitor) {}

  public abstract log(message: any, context?: string)

  public abstract warn(message: any, context?: string)

  public error(message: any, trace?: string, context?: string) {
    this.monitor.send(message, new Date())
  }
}
