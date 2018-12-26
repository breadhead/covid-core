import { ApiModelProperty } from '@nestjs/swagger'

import MonthYear, { monthYearExample } from './MonthYear'

export const exampleTreatment: Treatment = {
  region: 'Москва',
  when: monthYearExample,
  clinic: 'Клиника имени Чепухова',
  doctor: 'Чепухов Ж. Ж.',
}

export default abstract class Treatment {
  @ApiModelProperty({ example: exampleTreatment.region })
  public readonly region: string

  @ApiModelProperty({ example: exampleTreatment.when, required: false })
  public readonly when?: MonthYear

  @ApiModelProperty({ example: exampleTreatment.clinic, required: false })
  public readonly clinic?: string

  @ApiModelProperty({ example: exampleTreatment.doctor, required: false })
  public readonly doctor?: string
}
