import { Injectable } from '@nestjs/common'
import * as winston from 'winston'

const { combine, timestamp, label } = winston.format

import { Logger } from '@app/utils/infrastructure/Logger/Logger'
import { format } from './format'

@Injectable()
export class ConsoleLogger implements Logger {
  private readonly logger: winston.Logger

  public constructor() {
    this.logger = winston.createLogger({
      format: combine(label({ label: 'ohcohelp' }), timestamp(), format),
      transports: [new winston.transports.Console()],
    })
  }

  async log(message: any, context?: any) {
    const finalMessage = context
      ? `${message}, context: ${JSON.stringify(context)}`
      : message
    this.logger.info(finalMessage)
  }

  async warn(message: any, context?: string) {
    this.logger.warn(message)
  }

  async error(message: any, trace?: string, context?: string) {
    this.logger.error(message)
  }
}
