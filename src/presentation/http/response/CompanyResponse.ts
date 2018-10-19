import { ApiModelProperty } from '@nestjs/swagger'

import Company from '@app/domain/company/Company.entity'
import Donator from '@app/domain/company/Donator.dto'

export const exampleCompanyResponse = {
  name: 'Сбербанк',
  donation: 12233,
  logo: '/path/to/logo.png',
  site: 'google.com',
}

export default class CompanyResponse {
  public static fromEntity(company: Company) {
    return {
      name: company.name,
      logo: company.logo,
      site: company.site,
    } as CompanyResponse
  }

  public static fromDonator(donator: Donator) {
    return {
      name: donator.name,
      donation: donator.donation,
    } as CompanyResponse
  }

  @ApiModelProperty({ example: exampleCompanyResponse.name })
  public readonly name: string

  @ApiModelProperty({ example: exampleCompanyResponse.logo, required: false })
  public readonly logo?: string

  @ApiModelProperty({ example: exampleCompanyResponse.site, required: false })
  public readonly site?: string

  @ApiModelProperty({ example: exampleCompanyResponse.donation, required: false })
  public readonly donation?: number
}
