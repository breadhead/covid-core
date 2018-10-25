import { NestFactory } from '@nestjs/core'
import * as cors from 'cors'
import { join } from 'path'

import { AppModule } from '@app/app.module'
import setupSwagger from '@app/infrastructure/swagger'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  setupSwagger(app, 'docs')

  app.useStaticAssets(join(__dirname, '..', 'public'))

  const corsOptions = {
    origin: '*',
    credentials: true,
    allowHeaders: [
      'DNT',
      'User-Agent',
      'X-Requested-With',
      'If-Modified-Since',
      'Cache-Control',
      'Content-Type',
      'Range',
      'Authorization',
      'Cookie',
    ],
    methods: ['GET', 'POST', 'OPTIONS'],
  }
  app.use(cors(corsOptions))

  await app.listen(3000)
}
bootstrap()
