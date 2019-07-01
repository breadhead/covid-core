import chalk from 'chalk'
import * as winston from 'winston'
import { matches } from 'z'

const { printf } = winston.format

export const format = printf(info => {
  const mainColor = matches(info)(
    (_ = { level: 'info' }) => chalk.green,
    (_ = { level: 'warn' }) => chalk.yellow,
    (_ = { level: 'error' }) => chalk.red,
    _ => chalk.black,
  )

  const helpColor = chalk.grey

  const infoLabel = mainColor(`[${info.label}]`)
  const infoTimestamp = helpColor(
    new Date(info.timestamp).toLocaleString('ru-RU'),
  )
  const infoLevel = mainColor(`[${info.level}]`)
  const infoMessage = helpColor(info.message)

  return `${infoLabel} | ${infoTimestamp} | ${infoLevel}: ${infoMessage}`
})
