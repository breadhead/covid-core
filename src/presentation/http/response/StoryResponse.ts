import { ApiModelProperty } from '@nestjs/swagger'
import { StoryEnum } from '@app/domain/story/StoryEnum'

export default class StoryResponse {
  @ApiModelProperty({ example: 'mwkwml3~u338' })
  public readonly id: string

  @ApiModelProperty({ example: '05-11-2019' })
  public readonly createdAt: string

  @ApiModelProperty({ example: 'mwkwml3~u338' })
  public readonly claimId: string

  @ApiModelProperty({ example: '736928' })
  public readonly number: string

  @ApiModelProperty({ example: '8 800 123 45 67' })
  public readonly phone: string

  @ApiModelProperty({ example: StoryEnum.Called })
  public readonly status: StoryEnum

  @ApiModelProperty({ example: 'Катерина Петрован' })
  public readonly name: StoryEnum
}
