import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { Reflector } from '@nestjs/core'

import TokenPayload from '@app/infrastructure/security/TokenPayload'

export const ROLES_KEY = Symbol('roles')

@Injectable()
export default class RolesAuthGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  public canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get<string[]>(ROLES_KEY, context.getHandler())

    if (!roles) {
      return true
    }

    const request = context
      .switchToHttp()
      .getRequest()

    const { user } = request

    return user && user.roles && this.hasRole(user, roles)
  }

  private hasRole(user: TokenPayload, roles: string[]) {
    return user.roles.some((role) => roles.includes(role))
  }
}
