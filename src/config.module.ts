import { Module } from '@nestjs/common'

import ConfigurationFactory from '@app/infrastructure/Configuration/ConfigationFactory'

const configProvider = ConfigurationFactory.provider()

@Module({
  providers: [configProvider],
  exports: [configProvider],
})
export default class ConfigModule {}
