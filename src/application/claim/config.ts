import { Role } from '@app/user/model/Role'
import { CloseType } from './CloseClaimCommand'

export const successCloseClaimTypes = [
  CloseType.Successful,
  CloseType.NoAnswerNeeded,
]

export const rolesWithCloseLabel = [Role.CaseManager, Role.Client]

export type RolesWithCloseLabelType = Role.CaseManager | Role.Client
