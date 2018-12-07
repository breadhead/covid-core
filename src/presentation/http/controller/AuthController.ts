import { Body, Controller, HttpCode, Post } from '@nestjs/common'
import {
  ApiBadRequestResponse,
  ApiOkResponse,
  ApiOperation,
  ApiUseTags,
} from '@nestjs/swagger'

import Authenticator from '@app/application/user/auth/Authenticator'

import UserRepository from '@app/domain/user/UserRepository'
import { InjectRepository } from '@nestjs/typeorm'
import ApiUnauthorizedResponse from '../docs/ApiUnauthorizedResponse'
import LoginRequest from '../request/LoginRequest'
import RegistrationRequest from '../request/RegistrationRequest'
import ClientResponse from '../response/ClientResponse'
import TokenResponse from '../response/TokenResponse'

@Controller('auth')
@ApiUseTags('auth')
export default class AuthController {
  public constructor(
    @InjectRepository(UserRepository) private readonly userRepo: UserRepository,
    private readonly authenticator: Authenticator,
  ) {}

  @Post('register')
  @ApiOperation({ title: 'Create the new client' })
  @ApiOkResponse({ description: 'Registered', type: ClientResponse })
  @ApiBadRequestResponse({ description: 'Login already taken' })
  public register(
    @Body() registrationRequest: RegistrationRequest,
  ): ClientResponse {
    return {
      id: 'ffh',
      email: registrationRequest.email,
      phone: registrationRequest.phone,
    }
  }

  @Post('login')
  @HttpCode(200)
  @ApiOperation({ title: 'Issue the new token' })
  @ApiOkResponse({ description: 'Correct credentials', type: TokenResponse })
  @ApiUnauthorizedResponse({ description: 'Invalid credentials' })
  public async login(
    @Body() loginRequest: LoginRequest,
  ): Promise<TokenResponse> {
    const { login, password } = loginRequest

    const [token, user] = await Promise.all([
      await this.authenticator.signIn(login, password),
      await this.userRepo.getOne(login),
    ])

    const roles = user.roles.map(role => role.toString())

    return new TokenResponse(token, roles)
  }
}
