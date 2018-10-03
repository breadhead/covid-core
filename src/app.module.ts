import { Module } from '@nestjs/common'

import ConfigurationFactory from '@app/infrastructure/Configuration/ConfigationFactory'
import * as httpControllers from '@app/presentation/http/controller'

@Module({
  imports: [],
  controllers: [
    ...Object.values(httpControllers),
  ],
  providers: [
    ConfigurationFactory.provider(),
  ],
})
export class AppModule {}
