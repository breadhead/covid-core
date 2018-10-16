import { Controller, Get, Query, UseGuards } from '@nestjs/common'
import {
  ApiBearerAuth, ApiForbiddenResponse,
  ApiOkResponse, ApiOperation, ApiUseTags,
} from '@nestjs/swagger'

import PaginationPipe from '../request/pagination/PaginationPipe'
import PaginationRequest from '../request/pagination/PaginationRequest'
import ClientPageResponse from '../response/ClientPageResponse'
import JwtAuthGuard from '../security/JwtAuthGuard'

@Controller('clients')
@UseGuards(JwtAuthGuard)
@ApiUseTags('clients')
@ApiBearerAuth()
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
