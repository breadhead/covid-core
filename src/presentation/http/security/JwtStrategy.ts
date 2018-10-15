import { Inject, Injectable, UnauthorizedException } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'

import Authenticator from '@app/application/user/Authenticator'
import Configuration from '@app/infrastructure/Configuration/Configuration'

@Injectable()
export default class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly authenticator: Authenticator,
    @Inject(Configuration) config: Configuration,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.get('APP_SECRET').getOrElse('NotSoSecret'),
    })
  }

  public async validate(token: string) {
    const user = await this.authenticator.validateUser(token)

    if (!user) {
      throw new UnauthorizedException()
    }

    return user
  }
}
