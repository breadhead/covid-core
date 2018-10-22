import { ApiModelProperty } from '@nestjs/swagger'

import CompanyData, { exampleCompanyData } from './CompanyData'
import PersonalData, { examplePersonalData } from './PersonalData'

const exampleShortClaim = {
  id: 'fdsjf3k3k',
  personalData: examplePersonalData,
  diagnosis: 'На руке',
  theme: 'Рак кожи',
  company: exampleCompanyData,
}

export default class ShortClaimResponse {
  @ApiModelProperty({ example: exampleShortClaim.id })
  public readonly id: string

  @ApiModelProperty({ example: exampleShortClaim.personalData })
  public readonly personalData: PersonalData

  @ApiModelProperty({ example: exampleShortClaim.diagnosis })
  public readonly diagnosis?: string

  @ApiModelProperty({ example: exampleShortClaim.theme })
  public readonly theme: string

  @ApiModelProperty({ required: false, example: exampleShortClaim.company })
  public readonly company?: CompanyData
}
