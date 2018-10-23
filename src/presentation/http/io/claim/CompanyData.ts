import { ApiModelProperty } from '@nestjs/swagger'

export const exampleCompanyData = {
  company: 'Сбербанк',
  position: 'Директор',
}

export default class CompanyData {
  @ApiModelProperty({ example: exampleCompanyData.company })
  public readonly company: string

  @ApiModelProperty({ example: exampleCompanyData.position })
  public readonly  position: string
}
