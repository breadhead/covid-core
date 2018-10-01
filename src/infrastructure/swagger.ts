import { INestApplication, INestExpressApplication } from '@nestjs/common'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'

export default (app: INestApplication) => {
  const options = new DocumentBuilder()
    .setTitle('oncohelp-core')
    .setDescription('The core API documentation')
    .setVersion('1.0')
    .build()

  const document = SwaggerModule.createDocument(app, options)
  SwaggerModule.setup('docs', app, document)
}
