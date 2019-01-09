import { ApiModelProperty } from '@nestjs/swagger'

export const monthYearExample: MonthYear = {
  month: 12,
  year: 2019,
}

export default class MonthYear {
  public static fromDate(date?: Date): MonthYear | undefined {
    if (!date) {
      return undefined
    }

    // TODO: это костыль. Почему то из базы читается дата строкой, а не датой. Нужно исправть как будет время.
    if (typeof date === 'string') {
      date = new Date(date)
    }

    return {
      month: date.getMonth() + 1,
      year: date.getFullYear(),
    }
  }

  @ApiModelProperty({ example: monthYearExample.month })
  public readonly month: number
  @ApiModelProperty({ example: monthYearExample.year })
  public readonly year: number
}
