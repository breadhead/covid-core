import { NestFactory } from '@nestjs/core'
import * as bodyParser from 'body-parser'
import { join } from 'path'

import { AppModule } from '@app/app.module'
import corsMiddleware from '@app/corsMiddleware'
import setupSwagger from '@app/infrastructure/swagger'
import Logger from './infrastructure/Logger/Logger'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  setupSwagger(app, 'docs')

  app.useStaticAssets(join(__dirname, '..', 'public'))

  app.use(corsMiddleware())

  const logger = app.get<Logger>(Logger as any)
  app.use(bodyParser.json())
  app.use((req, _, next) => {
    if (req.method !== 'GET') {
      logger.log('Incomeing POST request', {
        path: req.path,
        body: req.body,
      })
    }

    next()
  })

  await app.listen(3000)
}
bootstrap()
