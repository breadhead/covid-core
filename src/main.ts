import { NestFactory } from '@nestjs/core'
import { join } from 'path'

import { AppModule } from '@app/app.module'
import corsMiddleware from '@app/corsMiddleware'
import setupSwagger from '@app/infrastructure/swagger'

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

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  setupSwagger(app, 'docs')

  app.useStaticAssets(join(__dirname, '..', 'public'))

  app.use(corsMiddleware())

  await app.listen(3000)
}
bootstrap()
