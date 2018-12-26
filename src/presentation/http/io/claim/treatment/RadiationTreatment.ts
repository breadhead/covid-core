import { ApiModelProperty } from '@nestjs/swagger'

import MonthYear, { monthYearExample } from './MonthYear'
import Treatment, { exampleTreatment } from './Treatment'

export const exampleRadiationTreatment: RadiationTreatment = {
  ...exampleTreatment,
  end: monthYearExample,
  cyclesCount: 12,
  schema: 'Фонарики светили на меня',
}

export default class RadiationTreatment extends Treatment {
  @ApiModelProperty({ example: exampleRadiationTreatment.end })
  public readonly end: MonthYear

  @ApiModelProperty({
    example: exampleRadiationTreatment.cyclesCount,
    required: false,
  })
  public readonly cyclesCount?: number

  @ApiModelProperty({
    example: exampleRadiationTreatment.schema,
    required: false,
  })
  public readonly schema?: string
}
