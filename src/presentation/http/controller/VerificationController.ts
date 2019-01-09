import { CommandBus } from '@breadhead/nest-throwable-bus'
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

import SendVerificationCommand from '@app/application/user/verification/SendVerificationCommand'
import VerificateCommand from '@app/application/user/verification/VerificateCommand'
import TokenPayload from '@app/infrastructure/security/TokenPayload'

import SendRequest from '../request/verification/SendRequest'
import VerificateRequest from '../request/verification/VerificateRequest'
import JwtAuthGuard from '../security/JwtAuthGuard'
import CurrentUser from './decorator/CurrentUser'

@Controller('verification')
@ApiUseTags('verification')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export default class VerificationController {
  public constructor(private readonly commandBus: CommandBus) {}

  @Post('send')
  @HttpCode(200)
  @UsePipes(ValidationPipe)
  @ApiOkResponse({ description: 'Success' })
  @ApiBadRequestResponse({ description: 'Invalid number' })
  public async send(
    @Body() request: SendRequest,
    @CurrentUser() user: TokenPayload,
  ): Promise<void> {
    await this.commandBus.execute(
      new SendVerificationCommand(request.number, user.login),
    )

    return
  }

  @Post('verificate')
  @HttpCode(200)
  @ApiOkResponse({ description: 'Verificated' })
  @ApiBadRequestResponse({ description: 'Invalid code' })
  public async verificate(
    @CurrentUser() user: TokenPayload,
    @Body() request: VerificateRequest,
  ): Promise<void> {
    const { login } = user
    const { code } = request

    await this.commandBus.execute(new VerificateCommand(login, code))

    return
  }
}
