import { ComposeMethodDecorators } from '@breadhead/detil-ts'
import { ReflectMetadata, UseGuards } from '@nestjs/common'

import Role from '@app/domain/user/Role'

import RolesAuthGuard, { ROLES_KEY } from './RolesAuthGuard'

const AddRoles = (...roles: Role[]) => ReflectMetadata(ROLES_KEY, roles)

export default (...roles: Role[]) => ComposeMethodDecorators([
  UseGuards(RolesAuthGuard),
  AddRoles(...roles),
])
