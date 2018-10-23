import { ApiModelProperty } from '@nestjs/swagger'

import Claim from '@app/domain/claim/Claim.entity'

import CompanyData, { exampleCompanyData } from './CompanyData'
import PersonalData, { examplePersonalData } from './PersonalData'

const exampleShortClaim = {
  id: 'fdsjf3k3k',
  personalData: examplePersonalData,
  diagnosis: 'На руке',
  theme: 'Рак кожи',
  company: exampleCompanyData,
}

export default class ShortClaimData {
  public static fromEntity(claim: Claim) {
    return {
      id: claim.id,
      personalData: {
        name: claim.applicant.name,
        gender: claim.applicant.gender,
        age: claim.applicant.age,
        region: claim.applicant.region,
        email: claim.author.conatcts.email,
        phone:  claim.author.conatcts.phone,
      } as PersonalData,
      diagnosis: '',
      theme: '',
      company: {
        name: '',
        position: '',
      },
    } as ShortClaimData
  }

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
