import { ApiModelProperty } from '@nestjs/swagger'

import MonthYear, { monthYearExample } from './MonthYear'
import Treatment, { exampleTreatment } from './Treatment'

export const exampleMidicalTreatment: MedicinalTreatment = {
  ...exampleTreatment,
  end: monthYearExample,
  cyclesCount: 12,
  schema: 'Пил таблетки разноцветные',
}

export default class MedicinalTreatment extends Treatment {
  @ApiModelProperty({ example: exampleMidicalTreatment.end, required: false })
  public readonly end?: MonthYear

  @ApiModelProperty({
    example: exampleMidicalTreatment.cyclesCount,
    required: false,
  })
  public readonly cyclesCount?: number

  @ApiModelProperty({
    example: exampleMidicalTreatment.schema,
    required: false,
  })
  public readonly schema?: string
}
