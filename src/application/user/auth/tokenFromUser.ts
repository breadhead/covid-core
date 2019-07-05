import { User } from '@app/user/model/User.entity'
import TokenPayload from '@app/infrastructure/security/TokenPayload'

export default (user: User) =>
  ({
    login: user.login,
    roles: user.roles.map(role => role.toString()),
  } as TokenPayload)
