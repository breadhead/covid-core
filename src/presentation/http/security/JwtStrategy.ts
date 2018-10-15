import { Injectable, UnauthorizedException } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'

import Authenticator from '@app/application/user/Authenticator'

@Injectable()
export default class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authenticator: Authenticator) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: 'secretKey',
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
