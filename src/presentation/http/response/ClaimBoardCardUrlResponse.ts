import { ApiModelProperty } from '@nestjs/swagger'

export default class ClaimBoardCardUrlResponse {
  public constructor(url: string) {
    this.url = url
  }

  @ApiModelProperty({ example: 'https://trello.com/c/aaAAAAaa' })
  public url: string
}
