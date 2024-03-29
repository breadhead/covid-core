import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'

@Injectable()
export default class JwtAuthGuard extends AuthGuard('jwt') {
  public canActivate(context: ExecutionContext) {
    return super.canActivate(context)
  }

  public handleRequest(err, user, info) {
    if (err || !user) {
      throw err || new UnauthorizedException()
    }

    return user
  }
}
