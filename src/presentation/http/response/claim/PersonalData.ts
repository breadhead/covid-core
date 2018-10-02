import { ApiModelProperty } from '@nestjs/swagger'

import ClientResponse from '../ClientResponse'
import { exampleClient } from '../ClientResponse'

export const examplePersonalData = {
  name: 'Петр Сергеевич',
  region: 'Кемеровская область',
  age: 57,
  client: exampleClient,
}

export default class PersonalData {
  @ApiModelProperty({ example: examplePersonalData.name })
  public readonly name: string

  @ApiModelProperty({ example: examplePersonalData.region })
  public readonly region: string

  @ApiModelProperty({ example: examplePersonalData.age })
  public readonly age: number

  @ApiModelProperty({ example: examplePersonalData.client })
  public readonly client: ClientResponse
}
