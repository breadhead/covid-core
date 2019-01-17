import { ApiModelProperty } from '@nestjs/swagger'

import User from '@app/domain/user/User.entity'

export const exampleDoctor = {
  login: 'chepuhov@oncohelp.core',
  fullName: 'Чепухов Николай Аворорович',
  descirpion: 'Лучший специлист эвер',
}

export default class DoctorResponse {
  public static fromEntity(user: User): DoctorResponse {
    return {
      login: user.login,
      fullName: user.fullName,
      description: user.decription,
    }
  }

  @ApiModelProperty({ example: exampleDoctor.login })
  public readonly login: string

  @ApiModelProperty({ example: exampleDoctor.fullName, required: false })
  public readonly fullName?: string

  @ApiModelProperty({ example: exampleDoctor.description, required: false })
  public readonly descirpion?: string
}
