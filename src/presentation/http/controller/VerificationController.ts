import {
  Body,
  Controller,
  HttpCode,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common'
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiOkResponse,
  ApiUseTags,
} from '@nestjs/swagger'

import TokenPayload from '@app/infrastructure/security/TokenPayload'

import SendRequest from '../request/verification/SendRequest'
import VerificateRequest from '../request/verification/VerificateRequest'
import JwtAuthGuard from '../security/JwtAuthGuard'
import CurrentUser from './decorator/CurrentUser'
import { Verificator } from '@app/user/application/Verificator'

@Controller('verification')
@ApiUseTags('verification')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export default class VerificationController {
  public constructor(private readonly verivicator: Verificator) {}

  @Post('send')
  @HttpCode(200)
  @UsePipes(ValidationPipe)
  @ApiOkResponse({ description: 'Success' })
  @ApiBadRequestResponse({ description: 'Invalid number' })
  public async send(
    @Body() { number }: SendRequest,
    @CurrentUser() { login }: TokenPayload,
  ): Promise<void> {
    await this.verivicator.sendCode(login, number)
  }

  @Post('verificate')
  @HttpCode(200)
  @ApiOkResponse({ description: 'Verificated' })
  @ApiBadRequestResponse({ description: 'Invalid code' })
  public async verificate(
    @CurrentUser() { login }: TokenPayload,
    @Body() { code }: VerificateRequest,
  ): Promise<void> {
    await this.verivicator.validateCode(login, code)
  }
}
