import { ApiModelProperty } from '@nestjs/swagger'

import Income from '@app/domain/quota/Income.entity'
import Transfer from '@app/domain/quota/Transfer.entity'

export enum TransactionKind {
  Income = 'Income',
  Transfer = 'Transfer',
}

export default class TransactionRepsonse {
  public static fromEntity(entity: Transfer | Income) {
    if (entity instanceof Transfer) {
      return fromTransfer(entity)
    }

    if (entity instanceof Income) {
      return fromIncome(entity)
    }
  }

  @ApiModelProperty({ example: 'Сбербанк' })
  public readonly from: string

  @ApiModelProperty({ example: 'Сотрудники Сбербанка' })
  public readonly to: string

  @ApiModelProperty({ example: 1000 })
  public readonly amount: number

  @ApiModelProperty({ example: new Date() })
  public readonly date: Date

  @ApiModelProperty({ example: TransactionKind.Income, enum: Object.values(TransactionKind) })
  public readonly kind: TransactionKind
}

const fromTransfer = (transfer: Transfer) => ({
  from: transfer.source.name,
  to: transfer.target.name,
  amount: transfer.amount,
  date: transfer.date,
  kind: TransactionKind.Transfer,
} as TransactionRepsonse)

const DEFAULT_PAYER = 'Unknown'

const fromIncome = (income: Income) => ({
  from: income.payer ? income.payer.name : DEFAULT_PAYER,
  to: income.target.name,
  amount: income.amount,
  date: income.date,
  kind: TransactionKind.Income,
} as any)
