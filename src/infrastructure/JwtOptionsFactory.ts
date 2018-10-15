import { Inject } from '@nestjs/common'
import { JwtModuleOptions, JwtOptionsFactory as Factory } from '@nestjs/jwt'

import Configuration from './Configuration/Configuration'

export default class JwtOptionsFactory implements Factory {
  public constructor(
    @Inject(Configuration) private readonly config: Configuration,
  ) { }

  public createJwtOptions(): JwtModuleOptions {
    return {
      secretOrPrivateKey: this.config.get('APP_SECRET').getOrElse('NotSoSecret'),
      signOptions: {
        expiresIn: 3600,
      },
    }
  }
}
