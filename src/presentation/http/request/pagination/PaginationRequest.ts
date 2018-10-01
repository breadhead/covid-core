import { ApiModelProperty } from '@nestjs/swagger'

export default class PaginationRequest {
  @ApiModelProperty({ required: false, default: 1, example: 3 })
  public readonly page: number = 1

  @ApiModelProperty({ required: false, default: 15, example: 40 })
  public readonly perPage: number = 10

  public constructor(
    page: number = 1,
    perPage: number = 10,
  ) {
    this.page = page
    this.perPage = perPage
  }
}
