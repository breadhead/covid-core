import { ApiModelProperty } from '@nestjs/swagger'

// tslint:disable-next-line:max-line-length
const exampleToken = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjE1Njg4MTE5ODUsImlkIjoxLCJzZXNzaW9uSWQiOiI1YmEwZjg1MWFiZWExIn0.XCe-rLCBQb1rPKhK8RYiu8WEmN3ZFSFbUuBfG4hgbxo'

export default class TokenResponse {
  @ApiModelProperty({ example: exampleToken })
  public readonly token: string

  public constructor(token: string) {
    this.token = token
  }
}
