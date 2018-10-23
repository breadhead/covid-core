import { ApiModelProperty } from '@nestjs/swagger'

import Gender from '@app/infrastructure/customTypes/Gender'

export const examplePersonalData = {
  name: 'Катерина Петрован',
  region: 'Кемеровская область',
  age: 57,
  gender: Gender.female,
  email: 'kate@gmail.com',
  phone: '+79999999999',
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

  @ApiModelProperty({ example: examplePersonalData.email, required: false })
  public readonly email?: string

  @ApiModelProperty({ example: examplePersonalData.phone, required: false })
  public readonly phone?: string
}
