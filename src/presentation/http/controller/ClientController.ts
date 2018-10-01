import { Body, Controller, Get, Post, Query } from '@nestjs/common'
import {
  ApiBadRequestResponse, ApiForbiddenResponse, ApiOkResponse,
  ApiOperation, ApiUseTags,
} from '@nestjs/swagger'

import PaginationPipe from '../request/pagination/PaginationPipe'
import PaginationRequest from '../request/pagination/PaginationRequest'
import RegistrationRequest from '../request/RegistrationRequest'
import ClientPageResponse from '../response/ClientPageResponse'
import ClientResponse from '../response/ClientResponse'

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

  @Post('/register')
  @ApiOperation({ title: 'Create the new client' })
  @ApiOkResponse({ description: 'Registered', type: ClientResponse })
  @ApiBadRequestResponse({ description: 'Login already taken' })
  public register(@Body() registrationRequest: RegistrationRequest): ClientResponse {
    return {
      id: 'ffh',
      email: registrationRequest.email,
      phone: registrationRequest.phone,
    }
  }
}
