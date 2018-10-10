import { ApiModelProperty } from '@nestjs/swagger'

import Company from '@app/domain/company/Company.entity'
import Donator from '@app/domain/company/Donator.dto'

export const exampleCompanyResponse = {
  name: 'Сбербанк',
  donation: 12233,
}

export default class CompanyResponse {
  public static fromEntity(company: Company) {
    return {
      name: company.name,
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

  @ApiModelProperty({ example: exampleCompanyResponse.donation, required: false })
  public readonly donation?: number
}