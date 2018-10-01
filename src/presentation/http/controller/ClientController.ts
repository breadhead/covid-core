import { Controller, Get, Query } from '@nestjs/common'
import {
  ApiForbiddenResponse, ApiOkResponse,
  ApiOperation, ApiUseTags,
} from '@nestjs/swagger'

import PaginationPipe from '../request/PaginationPipe'
import PaginationRequest from '../request/PaginationRequest'
import ClientPageResponse from '../response/ClientPageResponse'

@Controller('clients')
@ApiUseTags('clients')
export default class ClientController {
  @Get()
  @ApiOperation({ title: 'List of clients' })
  @ApiOkResponse({ description: 'Success', type: ClientPageResponse })
  @ApiForbiddenResponse({ description: 'Case-manager or Admin API token doesn\'t provided' })
  public showList(
    @Query(PaginationPipe) pagination: PaginationRequest,
  ): ClientPageResponse {
    return {
      page: pagination.page,
      perPage: pagination.perPage,
      total: 100,
      items: [
        { id: 'fds', email: 'perto@gmail.com' },
        { id: 'ffh', email: 'ann@gmail.com', phone: '79999999999' },
      ],
    }
  }
}
