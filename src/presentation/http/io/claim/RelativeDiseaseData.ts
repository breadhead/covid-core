import { ApiModelProperty } from '@nestjs/swagger'

export const relativeExampleData: RelativeDiseaseData = {
  relative: 'Бабушка',
  localization: 'Рак молочной железы',
  diagnosisAge: 23,
}

export default class RelativeDiseaseData {
  @ApiModelProperty({ example: relativeExampleData.relative })
  public readonly relative: string

  @ApiModelProperty({ example: relativeExampleData.localization })
  public readonly localization: string

  @ApiModelProperty({ example: relativeExampleData.diagnosisAge })
  public readonly diagnosisAge: number
}
