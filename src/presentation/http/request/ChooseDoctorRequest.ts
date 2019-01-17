import { ApiModelProperty } from '@nestjs/swagger'

export default class ChooseDoctorRequest {
  @ApiModelProperty({ example: 'jkjhhjhj34' })
  public readonly claimId: string

  @ApiModelProperty({ example: 'checpuhov@oncohelp.ru ' })
  public readonly doctorLogin: string
}
