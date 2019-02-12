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

const withHiding = (hide: boolean) => (str: string): string => (hide ? '' : str)

export default class ShortClaimData {
  public static fromEntity(
    claim: Claim,
    hideSensitiveData: boolean = false,
  ): ShortClaimData {
    const hide = withHiding(hideSensitiveData)

    const personalData = {
      name: hide(claim.applicant.name),
      gender: claim.applicant.gender,
      age: claim.applicant.age,
      region: claim.applicant.region,
      email: hide(claim.author.contacts.email),
      phone: hide(claim.author.contacts.phone),
    } as PersonalData

    const company = claim.corporateInfo
      .map(info => ({
        name: info.name,
        position: info.position,
      }))
      .getOrElse(null)

    return {
      id: claim.id,
      authorLogin: claim.author.login,
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
  public readonly authorLogin: string

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
