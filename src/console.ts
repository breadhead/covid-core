import { NestFactory } from '@nestjs/core'

import { AppModule } from '@app/app.module'
import CommandRunner from '@app/presentation/cli/CommandRunner'
import NullLoggerForCli from '@app/presentation/cli/NullLoggerForCli'
;(async () => {
  const app = await NestFactory.createApplicationContext(AppModule, {
    logger: new NullLoggerForCli(),
  })

  try {
    await app
      .select(AppModule)
      .get(CommandRunner)
      .run(process.argv)
  } catch (e) {
    throw e
  } finally {
    app.close()
  }
})()
