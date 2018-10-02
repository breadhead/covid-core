import { ApiModelProperty } from '@nestjs/swagger'
import { Option } from 'tsoption'

const DEFAULT_PAGE = 1
const DEFAULT_PER_PAGE = 10

export default class PaginationRequest {
  @ApiModelProperty({ required: false, default: 1, example: 3 })
  public readonly page: number = 1

  @ApiModelProperty({ required: false, default: 15, example: 40 })
  public readonly perPage: number = 10

  public constructor(
    page: Option<number>,
    perPage: Option<number>,
  ) {
    this.page = page.getOrElse(DEFAULT_PAGE)
    this.perPage = perPage.getOrElse(DEFAULT_PER_PAGE)
  }
}
