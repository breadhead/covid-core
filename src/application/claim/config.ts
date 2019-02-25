import Role from '@app/domain/user/Role'
import { CloseType } from './CloseClaimCommand'

export const successCloseClaimTypes = [
  CloseType.Successful,
  CloseType.NoAnswerNeeded,
]

export const rolesWithCloseLabel = [Role.CaseManager, Role.Client]
