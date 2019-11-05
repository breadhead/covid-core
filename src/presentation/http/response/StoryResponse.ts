import { ApiModelProperty } from '@nestjs/swagger'

export default class StoryResponse {
  @ApiModelProperty({ example: 'mwkwml3~u338' })
  public readonly id: string

  @ApiModelProperty({ example: 'mwkwml3~u338' })
  public readonly _claimId: string

  @ApiModelProperty({ example: '05-11-2019' })
  public readonly _createdAt: string

  @ApiModelProperty({ example: '8 800 123 45 67' })
  public readonly phone: string

  @ApiModelProperty({ example: 'Не позвонено' })
  public readonly status: string
}
