import { Body, Controller, HttpCode, Post } from '@nestjs/common'
import {
  ApiBadRequestResponse, ApiOkResponse,
  ApiOperation, ApiUseTags,
} from '@nestjs/swagger'

import Authenticator from '@app/application/user/Authenticator'

import ApiUnauthorizedResponse from '../docs/ApiUnauthorizedResponse'
import LoginRequest from '../request/LoginRequest'
import RegistrationRequest from '../request/RegistrationRequest'
import ClientResponse from '../response/ClientResponse'
import TokenResponse from '../response/TokenResponse'

@Controller('auth')
@ApiUseTags('auth')
export default class AuthController {
  public constructor(
    private readonly authenticator: Authenticator,
  ) { }

  @Post('register')
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

  @Post('login')
  @HttpCode(200)
  @ApiOperation({ title: 'Issue the new token' })
  @ApiOkResponse({ description: 'Correct credentials', type: TokenResponse })
  @ApiUnauthorizedResponse({ description: 'Invalid credentials' })
  public async login(@Body() loginRequest: LoginRequest): Promise<TokenResponse> {
    const token = await this.authenticator.signIn(
      loginRequest.login,
      loginRequest.password,
    )

    return new TokenResponse(token)
  }
}
