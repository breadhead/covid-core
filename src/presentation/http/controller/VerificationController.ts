import Message from '@app/domain/claim/Message.entity'
import MessageRepository from '@app/domain/claim/MessageRepository'
import Attribute from '@app/infrastructure/security/SecurityVoter/Attribute'
import SecurityVotersUnity from '@app/infrastructure/security/SecurityVoter/SecurityVotersUnity'
import TokenPayload from '@app/infrastructure/security/TokenPayload'
import { Body, Controller, Get, HttpCode, Param, Post, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common'
import {
  ApiBadRequestResponse, ApiBearerAuth, ApiCreatedResponse,
  ApiForbiddenResponse, ApiGoneResponse, ApiNotFoundResponse,
  ApiOkResponse, ApiOperation, ApiUseTags,
} from '@nestjs/swagger'
import { InjectRepository } from '@nestjs/typeorm'
import CurrentUser from '../request/CurrentUser'
import SendRequest from '../request/verification/SendRequest'
import VerificateRequest from '../request/verification/VerificateRequest'
import JwtAuthGuard from '../security/JwtAuthGuard'

@Controller('verification')
@ApiUseTags('verification')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export default class VerificationController {

  @Post('send')
  @HttpCode(200)
  @UsePipes(ValidationPipe)
  @ApiOkResponse({ description: 'Success' })
  @ApiBadRequestResponse({ description: 'Invalid number' })
  public async send(
    @Body() request: SendRequest,
    @CurrentUser() user: TokenPayload,
  ): Promise<void> {

    /* TODO: генерация кода подтверждения */
    /* TODO: отпражка смс по номеру телефона */

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
