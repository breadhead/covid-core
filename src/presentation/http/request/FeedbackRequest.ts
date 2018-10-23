import { ApiModelProperty } from '@nestjs/swagger'

export default class FeedbackRequest {
  @ApiModelProperty({ example: 'Петрович' })
  public readonly name: string

  @ApiModelProperty({ example: 'petrovich@mail.ru', required: false })
  public readonly email?: string

  @ApiModelProperty({ example: '89087652763', required: false })
  public readonly phone?: string

  @ApiModelProperty({ example: 'Здравствуйте, у меня вопрос!', required: false })
  public readonly theme?: string

  @ApiModelProperty({ example: 'Lorem ipsum dolor sit amet' })
  public readonly content: string
}
