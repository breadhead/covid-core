import { Controller, Get, Query, UseGuards } from '@nestjs/common'
import {
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiUseTags,
} from '@nestjs/swagger'
import { InjectRepository } from '@nestjs/typeorm'

import Role from '@app/domain/user/Role'

import UserRepository from '@app/domain/user/UserRepository'

import TokenPayload from '@app/infrastructure/security/TokenPayload'
import PaginationPipe from '../request/pagination/PaginationPipe'
import PaginationRequest from '../request/pagination/PaginationRequest'
import ClientPageResponse from '../response/ClientPageResponse'
import CurrentUserResponse from '../response/CurrentUserResponse'
import DoctorResponse from '../response/DoctorResponse'
import JwtAuthGuard from '../security/JwtAuthGuard'
import Roles from '../security/Roles'
import CurrentUser from './decorator/CurrentUser'

@Controller('users')
@UseGuards(JwtAuthGuard)
@ApiUseTags('users')
@ApiBearerAuth()
export default class UserController {
  public constructor(
    @InjectRepository(UserRepository) private readonly userRepo: UserRepository,
  ) {}

  @Get()
  @Roles(Role.CaseManager, Role.Admin)
  @ApiOperation({ title: 'List of clients' })
  @ApiOkResponse({ description: 'Success', type: ClientPageResponse })
  @ApiForbiddenResponse({
    description: 'Case-manager or Admin API token doesn`t provided',
  })
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

  @Get('users/current')
  @ApiOperation({ title: 'Current user' })
  @ApiOkResponse({
    description: 'Success',
    type: CurrentUserResponse,
  })
  @ApiForbiddenResponse({
    description: 'API token doesn`t provided',
  })
  public async showCurrentUser(
    @CurrentUser() tokenPayload: TokenPayload,
  ): Promise<CurrentUserResponse> {
    const user = await this.userRepo.getOne(tokenPayload.login)
    return CurrentUserResponse.fromUser(user)
  }

  @Get('doctors')
  @Roles(Role.CaseManager, Role.Admin)
  @ApiOperation({ title: 'List of doctors' })
  @ApiOkResponse({
    description: 'Success',
    type: DoctorResponse,
    isArray: true,
  })
  @ApiForbiddenResponse({
    description: 'Case-manager or Admin API token doesn`t provided',
  })
  public async showDoctors(): Promise<any> {
    const doctors = await this.userRepo.findDoctors()

    return doctors.map(DoctorResponse.fromEntity)
  }
}
