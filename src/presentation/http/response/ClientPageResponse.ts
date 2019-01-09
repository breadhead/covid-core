import { ApiModelProperty } from '@nestjs/swagger'

import ClientResponse from './ClientResponse'
import PageResponse from './PageResponse'

const itemsExample = [
  { id: 'fds', email: 'perto@gmail.com' },
  { id: 'ffh', email: 'ann@gmail.com', phone: '79999999999' },
]

export default class ClientPageReponse extends PageResponse<ClientResponse> {
  @ApiModelProperty({
    example: itemsExample,
    type: ClientResponse,
    isArray: true,
  })
  public readonly items: ClientResponse[]
}
