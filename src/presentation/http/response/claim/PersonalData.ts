import { ApiModelProperty } from '@nestjs/swagger'

import ClientResponse from '../ClientResponse'
import { exampleClient } from '../ClientResponse'

export enum Gender {
  male = 'male',
  female = 'female',
  nonbinary = 'nonbinary',
}

export const examplePersonalData = {
  name: 'Катерина Петрован',
  region: 'Кемеровская область',
  age: 57,
  client: exampleClient,
  gender: Gender.female,
}

export default class PersonalData {
  @ApiModelProperty({ example: examplePersonalData.name })
  public readonly name: string

  @ApiModelProperty({ example: examplePersonalData.region })
  public readonly region: string

  @ApiModelProperty({ example: examplePersonalData.age })
  public readonly age: number

  @ApiModelProperty({ example: examplePersonalData.gender, enum: Object.values(Gender) })
  public readonly gender: Gender

  @ApiModelProperty({ example: examplePersonalData.client })
  public readonly client: ClientResponse
}
