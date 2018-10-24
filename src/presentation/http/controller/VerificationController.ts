import Message from '@app/domain/claim/Message.entity'
import MessageRepository from '@app/domain/claim/MessageRepository'
import Attribute from '@app/infrastructure/security/SecurityVoter/Attribute'
import SecurityVotersUnity from '@app/infrastructure/security/SecurityVoter/SecurityVotersUnity'
import TokenPayload from '@app/infrastructure/security/TokenPayload'
import { CommandBus } from '@breadhead/nest-throwable-bus'
import { Body, Controller, Get, HttpCode, Param, Post, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common'
import {
  ApiBadRequestResponse, ApiBearerAuth, ApiCreatedResponse,
  ApiForbiddenResponse, ApiGoneResponse, ApiNotFoundResponse,
  ApiOkResponse, ApiOperation, ApiUseTags,
} from '@nestjs/swagger'
import { InjectRepository } from '@nestjs/typeorm'

import SendVerificationCommand from '@app/application/user/verification/SendVerificationCommand'
import SendRequest from '../request/verification/SendRequest'
import VerificateRequest from '../request/verification/VerificateRequest'
import JwtAuthGuard from '../security/JwtAuthGuard'
import CurrentUser from './decorator/CurrentUser'

@Controller('verification')
@ApiUseTags('verification')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export default class VerificationController {
  public constructor(
    private readonly commandBus: CommandBus,
  ) {}

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
  @ApiOkResponse({ description: 'write text' })
  @ApiBadRequestResponse({ description: 'write text' })
  public async verificate(
    @CurrentUser() user: TokenPayload,
    @Body() request: VerificateRequest,
  ): Promise<void> {

    /* TODO: функционал верификации кода подтерждения */

    return
  }
}
