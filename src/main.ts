import { NestFactory } from '@nestjs/core'
import * as bodyParser from 'body-parser'
import { join } from 'path'

import { AppModule } from '@app/app.module'
import corsMiddleware from '@app/corsMiddleware'
import setupSwagger from '@app/infrastructure/swagger'
import { answerRedisMiddleware } from './answerRedisMiddleware'
import { extraLoggerMiddleware } from './extraLoggerMiddleware'
import Configuration from './infrastructure/Configuration/Configuration'
import Logger from './infrastructure/Logger/Logger'
import { rateLimiter } from './rateLimiter'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  setupSwagger(app, 'docs')

  app.useStaticAssets(join(__dirname, '..', 'public'))

  app.use(corsMiddleware())

  app.use(bodyParser.json())

  const logger = app.get<Logger>(Logger as any)
  const config = app.get<Configuration>(Configuration as any)

  app.use(extraLoggerMiddleware(logger))
  app.use(answerRedisMiddleware(config))
  app.use(rateLimiter(app))

  await app.listen(3000)
}
bootstrap()
