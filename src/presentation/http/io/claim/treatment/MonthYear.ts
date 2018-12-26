import { ApiModelProperty } from '@nestjs/swagger'

export const monthYearExample: MonthYear = {
  month: 12,
  year: 2019,
}

export default class MonthYear {
  @ApiModelProperty({ example: monthYearExample.month })
  public readonly month: number
  @ApiModelProperty({ example: monthYearExample.year })
  public readonly year: number
}
