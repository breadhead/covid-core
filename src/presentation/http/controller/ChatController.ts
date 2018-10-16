import { CommandBus } from '@breadhead/nest-throwable-bus'
import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common'
import {
  ApiBearerAuth, ApiCreatedResponse, ApiForbiddenResponse,
  ApiGoneResponse, ApiNotFoundResponse, ApiOkResponse,
  ApiOperation, ApiUseTags,
} from '@nestjs/swagger'
import { InjectRepository } from '@nestjs/typeorm'

import PostMessageCommand from '@app/application/claim/PostMessageCommand'
import Message from '@app/domain/claim/Message.entity'
import MessageRepository from '@app/domain/claim/MessageRepository'
import SecurityVotersUnity from '@app/infrastructure/security/SecurityVoter/SecurityVotersUnity'
import TokenPayload from '@app/infrastructure/security/TokenPayload'

import ChatMessageRequest from '../request/ChatMessageRequest'
import CurrentUser from '../request/CurrentUser'
import ChatMessageResponse from '../response/ChatMessageResponse'
import JwtAuthGuard from '../security/JwtAuthGuard'

@Controller('chat')
@UseGuards(JwtAuthGuard)
@ApiUseTags('chat')
@ApiBearerAuth()
export default class ChatController {
  public constructor(
    @InjectRepository(MessageRepository) private readonly messageRepo: MessageRepository,
    private readonly bus: CommandBus,
    private readonly votersUnity: SecurityVotersUnity,
  ) { }

  @Get(':id')
  @ApiOperation({ title: 'Message list' })
  @ApiOkResponse({ description: 'Success', type: ChatMessageResponse, isArray: true })
  @ApiNotFoundResponse({ description: 'Chat for claim with the provided id not found' })
  @ApiForbiddenResponse({ description: 'Claim\'s owner, case-manager or doctor API token doesn\'t provided '})
  public async showChat(@Param('id') id: string): Promise<ChatMessageResponse[]> {
    const messages = await this.messageRepo.findByClaimId(id)

    return messages.map(ChatMessageResponse.fromEntity)
  }

  @Post(':id')
  @ApiOperation({ title: 'Add new message' })
  @ApiCreatedResponse({ description: 'Message added', type: ChatMessageResponse })
  @ApiGoneResponse({ description: 'Chat locked' })
  @ApiNotFoundResponse({ description: 'Chat for claim with the provided id not found' })
  @ApiForbiddenResponse({ description: 'Claim\'s owner, case-manager or doctor API token doesn\'t provided '})
  public async addMessage(
    @Param('id') claimId: string,
    @CurrentUser() user: TokenPayload,
    @Body() request: ChatMessageRequest,
  ): Promise<ChatMessageResponse> {
    const { id, content, date } = request
    const command = new PostMessageCommand(id, date, content, claimId, user.login)

    await this.votersUnity.denyAccessUnlessGranted('execute', command, user)

    const message: Message = await this.bus.execute(command)

    return ChatMessageResponse.fromEntity(message)
  }
}
