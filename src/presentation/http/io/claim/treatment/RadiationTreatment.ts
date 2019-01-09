import { ApiModelProperty } from '@nestjs/swagger'

import Vo from '@app/domain/claim/treatment/RadiationTreatment'

import MonthYear, { monthYearExample } from './MonthYear'
import Treatment, { exampleTreatment } from './Treatment'

export const exampleRadiationTreatment: RadiationTreatment = {
  ...exampleTreatment,
  end: monthYearExample,
  cyclesCount: 12,
  schema: 'Фонарики светили на меня',
}

export default class RadiationTreatment extends Treatment {
  public static fromVo(vo: Vo): RadiationTreatment {
    return {
      region: vo.region,
      when: MonthYear.fromDate(vo.when),
      clinic: vo.clinic,
      doctor: vo.doctor,
      end: MonthYear.fromDate(vo.end),
      cyclesCount: vo.cyclesCount,
      schema: vo.schema,
    }
  }

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
