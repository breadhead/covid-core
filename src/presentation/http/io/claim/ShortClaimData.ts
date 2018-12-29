import { ApiModelProperty } from '@nestjs/swagger'

import Claim, { ClaimTarget } from '@app/domain/claim/Claim.entity'

import CompanyData, { exampleCompanyData } from './CompanyData'
import PersonalData, { examplePersonalData } from './PersonalData'

const exampleShortClaim = {
  id: 'fdsjf3k3k',
  personalData: examplePersonalData,
  localization: 'На руке',
  theme: 'Рак кожи',
  company: exampleCompanyData,
  target: ClaimTarget.Self,
}

export default class ShortClaimData {
  public static fromEntity(claim: Claim): ShortClaimData {
    const personalData = {
      name: claim.applicant.name,
      gender: claim.applicant.gender,
      age: claim.applicant.age,
      region: claim.applicant.region,
      email: claim.author.conatcts.email,
      phone: claim.author.conatcts.phone,
    } as PersonalData

    const company = claim.corporateInfo
      .map(info => ({
        name: info.name,
        position: info.position,
      }))
      .getOrElse(null)

    return {
      id: claim.id,
      personalData,
      localization: claim.localization,
      theme: claim.theme,
      company,
      target: claim.target,
      quotaAllocated: !!claim.quota,
    }
  }

  @ApiModelProperty({ example: exampleShortClaim.id })
  public readonly id: string

  @ApiModelProperty({ example: exampleShortClaim.personalData })
  public readonly personalData: PersonalData

  @ApiModelProperty({ example: exampleShortClaim.localization })
  public readonly localization?: string

  @ApiModelProperty({ example: exampleShortClaim.theme })
  public readonly theme: string

  @ApiModelProperty({ required: false, example: exampleShortClaim.company })
  public readonly company?: CompanyData

  @ApiModelProperty({
    example: ClaimTarget.Self,
    enum: Object.values(ClaimTarget),
  })
  public readonly target: ClaimTarget

  @ApiModelProperty({ example: true })
  public readonly quotaAllocated: boolean
}
