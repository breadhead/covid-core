import { ApiModelProperty } from '@nestjs/swagger'

import Draft from '@app/domain/draft/Draft.entity'

export default class DraftResponse {
  public static fromEntity(draft: Draft) {
    return {
      id: draft.id,
      body: draft.body,
    } as DraftResponse
  }

  @ApiModelProperty({ example: 'fdsfsdfkljksc6' })
  public readonly id: string

  @ApiModelProperty({ example: { name: 'Petro', age: 12 } })
  public readonly body: any
}
