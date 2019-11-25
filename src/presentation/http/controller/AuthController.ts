import { Body, Controller, HttpCode, Post } from '@nestjs/common'
import {
  ApiBadRequestResponse,
  ApiOkResponse,
  ApiOperation,
  ApiUseTags,
} from '@nestjs/swagger'

import Authenticator from '@app/application/user/auth/Authenticator'
import TokenPayload from '@app/infrastructure/security/TokenPayload'
import { JwtService } from '@nestjs/jwt'
import ApiUnauthorizedResponse from '../docs/ApiUnauthorizedResponse'
import LoginRequest from '../request/LoginRequest'
import RegistrationRequest from '../request/RegistrationRequest'
import ClientResponse from '../response/ClientResponse'
import TokenResponse from '../response/TokenResponse'
import { UserRepository } from '@app/user/service/UserRepository'
import { PasswordManager } from '@app/user/application/PasswordManager'
import { PasswordResetRequest } from '../request/PasswordResetRequest'

@Controller('auth')
@ApiUseTags('auth')
export default class AuthController {
  public constructor(
    private readonly userRepo: UserRepository,
    private readonly authenticator: Authenticator,
    private readonly jwtService: JwtService,
    private readonly passwordManager: PasswordManager,
  ) {}

  @Post('register')
  @ApiOperation({ title: 'Create the new client' })
  @ApiOkResponse({ description: 'Registered', type: ClientResponse })
  @ApiBadRequestResponse({ description: 'Login already taken' })
  public async register(
    @Body() registrationRequest: RegistrationRequest,
  ): Promise<TokenResponse> {
    const { email, password, confirm } = registrationRequest

    const { token, user } = await this.authenticator.signUp(
      email,
      password,
      confirm,
    )

    const roles = user.roles.map(role => role.toString())

    return new TokenResponse(token, roles)
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

    const token = await this.authenticator.signIn(login, password)

    const payload = this.jwtService.decode(token, {}) as TokenPayload

    const user = await this.userRepo.getOne(payload.login)

    const roles = user.roles.map(role => role.toString())

    return new TokenResponse(token, roles)
  }

  @Post('reset-password')
  @HttpCode(200)
  @ApiOperation({ title: 'Reset password' })
  public async resetPassword(
    @Body() request: PasswordResetRequest,
  ): Promise<string> {
    const { login } = request

    await this.passwordManager.reset(login)

    const user = await this.userRepo.getOneByContactEmail(login)

    if (!user.contacts.phone) {
      return null
    }

    return this.hidePhoneNumber(user.contacts.phone)
  }

  private hidePhoneNumber = (phone: string) =>
    phone.substr(-2, 2).padStart(10, '*')
}
