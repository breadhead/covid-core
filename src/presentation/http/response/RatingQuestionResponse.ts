import { ApiModelProperty } from '@nestjs/swagger'

export default class RatingQuestionResponse {
  @ApiModelProperty({ example: 'mwkwml3~u338' })
  public readonly id: string

  @ApiModelProperty({ example: 'value' })
  public readonly type: string

  @ApiModelProperty({ example: 'Вам нравки наш сервис?' })
  public readonly question: string

  @ApiModelProperty({ example: '1 — ненра, 10 — оч нра' })
  public readonly hint: string
}
