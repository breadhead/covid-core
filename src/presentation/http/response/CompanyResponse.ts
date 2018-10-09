import { ApiModelProperty } from '@nestjs/swagger'

import Company from '@app/domain/company/Company.entity'

export const exampleCompanyResponse = {
  name: 'Сбербанк',
}

export default class CompanyResponse {
  public static fromEntity(company: Company) {
    return {
      name: company.name,
    } as CompanyResponse
  }
  @ApiModelProperty({ example: exampleCompanyResponse.name })
  public readonly name: string
}
