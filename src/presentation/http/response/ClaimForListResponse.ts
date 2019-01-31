import { ApiModelProperty } from '@nestjs/swagger'

import Claim, { ClaimStatus, ClaimTarget } from '@app/domain/claim/Claim.entity'

export enum Status {
  Draft = 'Черновик',
  Closed = 'Закрыта',
  Denied = 'Отказ',
  QuotaAllocation = 'Распределение квоты',
  QueueForQuota = 'В очереди на квоту',
  QuestionnaireWaiting = 'Ожидание анкеты',
  QuestionnaireValidation = 'Проверка анкеты',
  AtTheDoctor = 'У врача',
  AnswerValidation = 'Проверка ответа эксперта',
  DeliveredToCustomer = 'Передано заказчику',
}

const defineStatus = (originalStatus: ClaimStatus) =>
  ({
    [ClaimStatus.New]: Status.Draft,
    [ClaimStatus.QuotaAllocation]: Status.QuotaAllocation,
    [ClaimStatus.QueueForQuota]: Status.QueueForQuota,
    [ClaimStatus.QuestionnaireWaiting]: Status.QuestionnaireWaiting,
    [ClaimStatus.QuestionnaireValidation]: Status.QuestionnaireValidation,
    [ClaimStatus.AtTheDoctor]: Status.AtTheDoctor,
    [ClaimStatus.AnswerValidation]: Status.AnswerValidation,
    [ClaimStatus.DeliveredToCustomer]: Status.DeliveredToCustomer,
    [ClaimStatus.ClosedSuccessfully]: Status.Closed,
    [ClaimStatus.Denied]: Status.Denied,
  }[originalStatus])

export default class ClaimForListResponse {
  public static fromClaim(claim: Claim): ClaimForListResponse {
    return {
      id: claim.id,
      number: claim.number,
      createdAt: claim.createdAt || new Date(),
      status: defineStatus(claim.status),
      expireAt: claim.due.getOrElse(undefined),
      email: claim.author.contacts.email,
      target: claim.target,
    }
  }

  @ApiModelProperty({ example: 'dsflkdj2' })
  public readonly id: string

  @ApiModelProperty({ example: 1003 })
  public readonly number: number

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

  @ApiModelProperty({
    example: ClaimTarget.Self,
    enum: Object.values(ClaimTarget),
  })
  public readonly target: ClaimTarget
}
