import { ApiModelProperty } from '@nestjs/swagger'

import CompanyData, { exampleCompanyData } from './CompanyData'
import PersonalData, { examplePersonalData } from './PersonalData'

const exampleCommonClaim = {
  id: 'fdsjf3k3k',
  personalData: examplePersonalData,
  diagnosis: 'На руке',
  theme: 'Рак кожи',
  urgency: 'Не очень срочно.',
  company: exampleCompanyData,
}

export default class CommonClaimResponse {
  @ApiModelProperty({ example:  exampleCommonClaim.id })
  public readonly id: string

  @ApiModelProperty({ example: exampleCommonClaim.personalData })
  public readonly personalData: PersonalData

  @ApiModelProperty({ example: exampleCommonClaim.diagnosis })
  public readonly diagnosis?: string

  @ApiModelProperty({ example: exampleCommonClaim.theme })
  public readonly theme: string

  @ApiModelProperty({ example: exampleCommonClaim.urgency })
  public readonly urgency: string

  @ApiModelProperty({ required: false, example: exampleCommonClaim.company })
  public readonly company?: CompanyData
}
