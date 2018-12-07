import { ApiModelProperty } from '@nestjs/swagger'

export const exampleCompanyData = {
  name: 'Сбербанк',
  position: 'Директор',
}

export default class CompanyData {
  @ApiModelProperty({ example: exampleCompanyData.name })
  public readonly name: string

  @ApiModelProperty({ example: exampleCompanyData.position })
  public readonly position: string
}
