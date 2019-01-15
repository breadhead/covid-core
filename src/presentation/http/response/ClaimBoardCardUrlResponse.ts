import { ApiModelProperty } from '@nestjs/swagger'

export default class ClaimBoardCardUrlResponse {
  public static fromUrl(url: string) {
    return {
      url,
    }
  }

  @ApiModelProperty({ example: 'https://trello.com/c/aaAAAAaa' })
  public url: string
}
