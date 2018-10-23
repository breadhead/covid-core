import { ApiModelProperty } from '@nestjs/swagger'

export default class DraftRequest {
  @ApiModelProperty({ example: { name: 'Petro', age: 12 } })
  public readonly body: any
}
