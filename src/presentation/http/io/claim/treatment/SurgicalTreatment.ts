import { ApiModelProperty } from '@nestjs/swagger'

import Vo from '@app/domain/claim/treatment/SurgicalTreatment'

import MonthYear from './MonthYear'
import Treatment, { exampleTreatment } from './Treatment'

export const exampleSurgicalTreatment: SurgicalTreatment = {
  ...exampleTreatment,
  surgery: 'Удаление всего',
}

export default class SurgicalTreatment extends Treatment {
  public static fromVo(vo: Vo) {
    return {
      region: vo.region,
      when: MonthYear.fromDate(vo.when),
      clinic: vo.clinic,
      doctor: vo.doctor,
      surgery: vo.surgery,
    }
  }

  @ApiModelProperty({ example: exampleSurgicalTreatment.surgery })
  public readonly surgery: string
}
