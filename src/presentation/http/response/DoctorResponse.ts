import { ApiModelProperty } from '@nestjs/swagger'

import User from '@app/domain/user/User.entity'

export const exampleDoctor = {
  login: 'chepuhov@oncohelp.core',
  fullName: 'Чепухов Николай Аворорович',
  description: 'Лучший специлист эвер',
  assigned: false,
}

export default class DoctorResponse {
  public static fromEntity(user: User): DoctorResponse {
    return {
      login: user.login,
      fullName: user.fullName,
      description: user.description,
      assigned: false,
    }
  }

  @ApiModelProperty({ example: exampleDoctor.login })
  public readonly login: string

  @ApiModelProperty({ example: exampleDoctor.fullName, required: false })
  public readonly fullName?: string

  @ApiModelProperty({ example: exampleDoctor.description, required: false })
  public readonly description?: string

  @ApiModelProperty({ example: exampleDoctor.assigned, required: false })
  public readonly assigned: boolean
}
