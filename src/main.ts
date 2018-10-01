import { NestFactory } from '@nestjs/core'

import { AppModule } from '@app/app.module'
import setupSwagger from '@app/infrastructure/swagger'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  setupSwagger(app, 'docs')

  await app.listen(3000)
}
bootstrap()
