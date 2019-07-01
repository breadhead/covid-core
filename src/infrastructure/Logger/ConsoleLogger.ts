import { Inject, Injectable } from '@nestjs/common'
import * as winston from 'winston'

const { combine, timestamp, label } = winston.format

import Logger from './Logger'
import Monitor, { Monitor as MonitorSymbol } from './Monitor/Monitor'
import { format } from './helpers/format'

@Injectable()
export default class ConsoleLogger extends Logger {
  private readonly logger: winston.Logger

  public constructor(@Inject(MonitorSymbol) monitor: Monitor) {
    super(monitor)

    this.logger = winston.createLogger({
      format: combine(label({ label: 'ohcohelp' }), timestamp(), format),
      transports: [new winston.transports.Console()],
    })
  }

  public log(message: any, context?: any) {
    const finalMessage = context
      ? `${message}, context: ${JSON.stringify(context)}`
      : message
    this.logger.info(finalMessage)
  }

  public warn(message: any, context?: string) {
    this.logger.warn(message)
  }

  public error(message: any, trace?: string, context?: string) {
    super.error(message, trace, context)

    this.logger.error(message)
  }
}
