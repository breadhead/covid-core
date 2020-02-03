import { ApiModelProperty } from '@nestjs/swagger'

export default class CreateDoctorRequest {
  @ApiModelProperty({ example: 'Реброва' })
  public readonly name: string

  @ApiModelProperty({ example: 'password' })
  public readonly rawPassword: string

  @ApiModelProperty({ example: 'rebrova@oncohelp.ru ' })
  public readonly email: string

  @ApiModelProperty({ example: 'лучшая врачиня в мире' })
  public readonly description?: string

  @ApiModelProperty({ example: '@user88472084 ' })
  public readonly boardUsername?: string

  @ApiModelProperty({ example: '@rebrovale' })
  public readonly telegramId?: string
}
