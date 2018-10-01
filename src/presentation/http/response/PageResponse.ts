import { ApiModelProperty } from '@nestjs/swagger'

export default abstract class PageResponse<T> {
  @ApiModelProperty({ example: 1 })
  public readonly page: number

  @ApiModelProperty({ example: 10 })
  public readonly perPage: number

  @ApiModelProperty({ example: 100 })
  public readonly total: number

  public abstract readonly items: T[]
}
