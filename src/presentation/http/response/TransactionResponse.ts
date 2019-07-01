import { ApiModelProperty } from '@nestjs/swagger'

import Income from '@app/domain/quota/Income.entity'
import Transfer from '@app/domain/quota/Transfer.entity'
import LogicException from '../exception/LogicException'

export enum TransactionKind {
  Income = 'Income',
  Transfer = 'Transfer',
}

const DEFAULT_PAYER = 'Unknown'

export default class TransactionRepsonse {
  public static fromEntity(entity: Transfer | Income) {
    if (entity instanceof Transfer) {
      return {
        from: entity.source.name,
        to: entity.target.name,
        amount: entity.amount,
        date: entity.date,
        kind: TransactionKind.Transfer,
      } as TransactionRepsonse
    }

    if (entity instanceof Income) {
      return {
        from: entity.payer ? entity.payer.name : DEFAULT_PAYER,
        to: entity.target.name,
        amount: entity.amount,
        date: entity.date,
        kind: TransactionKind.Income,
      } as TransactionRepsonse
    }

    throw new LogicException('Transaction is not a Income or Transfer')
  }

  @ApiModelProperty({ example: 'Сбербанк' })
  public readonly from: string

  @ApiModelProperty({ example: 'Сотрудники Сбербанка' })
  public readonly to: string

  @ApiModelProperty({ example: 1000 })
  public readonly amount: number

  @ApiModelProperty({ example: new Date() })
  public readonly date: Date

  @ApiModelProperty({
    example: TransactionKind.Income,
    enum: Object.values(TransactionKind),
  })
  public readonly kind: TransactionKind
}
