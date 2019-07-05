import { ComposeMethodDecorators } from '@breadhead/detil-ts'
import { ReflectMetadata, UseGuards } from '@nestjs/common'

import RolesAuthGuard, { ROLES_KEY } from './RolesAuthGuard'
import { Role } from '@app/user/model/Role'

const AddRoles = (...roles: Role[]) => ReflectMetadata(ROLES_KEY, roles)

export default (...roles: Role[]) =>
  ComposeMethodDecorators([UseGuards(RolesAuthGuard), AddRoles(...roles)])
