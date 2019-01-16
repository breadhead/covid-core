import { ApiModelProperty } from '@nestjs/swagger'

import User from '@app/domain/user/User.entity'

export const exampleDoctor = {
  login: 'chepuhov@oncohelp.core',
  fullName: 'Чепухов Николай Аворорович',
}

export default class DoctorResponse {
  public static fromEntity(user: User): DoctorResponse {
    return {
      login: user.login,
      fullName: user.fullName,
    }
  }

  @ApiModelProperty({ example: exampleDoctor.login })
  public readonly login: string

  @ApiModelProperty({ example: exampleDoctor.fullName, required: false })
  public readonly fullName?: string
}
