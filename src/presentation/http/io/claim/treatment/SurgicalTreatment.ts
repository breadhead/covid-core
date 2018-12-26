import { ApiModelProperty } from '@nestjs/swagger'

import Treatment, { exampleTreatment } from './Treatment'

export const exampleSurgicalTreatment: SurgicalTreatment = {
  ...exampleTreatment,
  surgery: 'Удаление всего',
}

export default class SurgicalTreatment extends Treatment {
  @ApiModelProperty({ example: exampleSurgicalTreatment.surgery })
  public readonly surgery: string
}
