import { ApiModelProperty } from '@nestjs/swagger'

import Claim, { ClaimStatus } from '@app/domain/claim/Claim.entity'
import Draft from '@app/domain/draft/Draft.entity'

export enum Status {
  Draft = 'Черновик',
  Closed = 'Закрыта',
  QuotaAllocation = 'Распределение квоты',
  QuestionnaireWaiting = 'Ожидание анкеты',
  QuestionnaireValidation = 'Проверка анкеты',
  DeliveredToCustomer = 'Передано заказчику',
}

const defineStatus = (originalStatus: ClaimStatus) =>
  ({
    [ClaimStatus.New]: Status.Draft,
    [ClaimStatus.QuotaAllocation]: Status.QuotaAllocation,
    [ClaimStatus.QueueForQuota]: Status.QuotaAllocation,
    [ClaimStatus.QuestionnaireWaiting]: Status.QuestionnaireWaiting,
    [ClaimStatus.QuestionnaireValidation]: Status.QuestionnaireValidation,
    [ClaimStatus.AtTheDoctor]: Status.QuestionnaireValidation,
    [ClaimStatus.AnswerValidation]: Status.QuestionnaireValidation,
    [ClaimStatus.DeliveredToCustomer]: Status.DeliveredToCustomer,
    [ClaimStatus.ClosedSuccessfully]: Status.Closed,
    [ClaimStatus.Denied]: Status.Closed,
  }[originalStatus])

export default class ClaimForListResponse {
  public static fromClaim(claim: Claim): ClaimForListResponse {
    return {
      id: claim.id,
      createdAt: claim.createdAt || new Date(),
      status: defineStatus(claim.status),
      expireAt: claim.due.getOrElse(undefined),
      email: claim.author.conatcts.email,
      personal: claim.personal,
    }
  }

  public static fromDraft(draft: Draft): ClaimForListResponse {
    return {
      id: draft.id,
      createdAt: draft.createdAt || new Date(),
      status: Status.Draft,
      personal: draft.personal,
    }
  }

  @ApiModelProperty({ example: 'dsflkdj2' })
  public readonly id: string

  @ApiModelProperty({ example: new Date() })
  public readonly createdAt: Date

  @ApiModelProperty({ example: new Date() })
  public readonly expireAt?: Date

  @ApiModelProperty({ example: Status.Draft, enum: Object.values(Status) })
  public readonly status: Status

  @ApiModelProperty({ example: true, required: false })
  public readonly newMessage?: boolean

  @ApiModelProperty({ example: 'email@mail.com', required: false })
  public readonly email?: string

  @ApiModelProperty({ example: true })
  public readonly personal: boolean
}
