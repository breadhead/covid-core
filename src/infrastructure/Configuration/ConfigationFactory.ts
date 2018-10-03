import { Provider } from '@nestjs/common'
import * as path from 'path'

import Configuration from './Configuration'
import DevConfiguration from './DevConfiguration'
import ProdConfiguration from './ProdConfiguration'

const isDev = () => process.env.NODE_ENV === 'development'

export default class ConfigurationFactory {
  public static create(): Configuration {
    if (isDev()) {
      return new DevConfiguration(path.resolve(__dirname, '../../../.env'))
    }

    return new ProdConfiguration()
  }

  public static provider(): Provider {
    return {
      provide: Configuration,
      useValue: ConfigurationFactory.create(),
    }
  }
}
