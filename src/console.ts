import { NestFactory } from '@nestjs/core'

import { AppModule } from '@app/app.module'
import CommandRunner from '@app/presentation/cli/CommandRunner'

const start = async () => {
  const app = await NestFactory.createApplicationContext(AppModule)
  let error

  try {
    await app
      .select(AppModule)
      .get(CommandRunner)
      .run(process.argv)
  } catch (e) {
    error = e
  } finally {
    await app.close()

    if (error) {
      console.error(error)
      process.exit(1)
    } else {
      process.exit(0)
    }
  }
}

start()
