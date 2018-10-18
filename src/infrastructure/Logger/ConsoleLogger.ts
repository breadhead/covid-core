import { Inject, Injectable } from '@nestjs/common'
import chalk from 'chalk'
import * as winston from 'winston'
import { matches } from 'z'

const { combine, timestamp, label, printf } = winston.format

import Logger from './Logger'
import Monitor, { Monitor as MonitorSymbol } from './Monitor/Monitor'

@Injectable()
export default class ConsoleLogger extends Logger {
  private readonly logger: winston.Logger

  public constructor(@Inject(MonitorSymbol) monitor: Monitor) {
    super(monitor)

    this.logger = winston.createLogger({
      format: combine(
        label({ label: 'ohcohelp' }),
        timestamp(),
        format,
      ),
      transports: [
        new winston.transports.Console(),
      ],
    })
  }

  public log(message: any, context?: string) {
    this.logger.info(message)
  }

  public warn(message: any, context?: string) {
    this.logger.warn(message)
  }

  public error(message: any, trace?: string, context?: string) {
    super.error(message, trace, context)

    this.logger.error(message)
  }
}

const format = printf((info) => {
  const mainColor = matches(info)(
    (_ = { level: 'info'  }) => chalk.green,
    (_ = { level: 'warn'  }) => chalk.yellow,
    (_ = { level: 'error' }) => chalk.red,
    (_)                      => (text: string) => text,
  )

  const helpColor = chalk.grey

  const infoLabel = mainColor(`[${info.label}]`)
  const infoTimestamp = helpColor(new Date(info.timestamp).toLocaleString('ru-RU'))
  const infoLevel = mainColor(`[${info.level}]`)
  const infoMessage = helpColor(info.message)

  return `${infoLabel} | ${infoTimestamp} | ${infoLevel}: ${infoMessage}`
})
