import { CommandBus } from '@breadhead/nest-throwable-bus'
import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common'
import {
  ApiBearerAuth,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiUseTags,
} from '@nestjs/swagger'
import { InjectRepository } from '@nestjs/typeorm'

import CreateDraftCommand from '@app/application/draft/CreateDraftCommand'
import EditDraftCommand from '@app/application/draft/EditDraftCommand'
import Draft from '@app/domain/draft/Draft.entity'
import DraftRepository from '@app/domain/draft/DraftRepository'
import Attribute from '@app/infrastructure/security/SecurityVoter/Attribute'
import SecurityVotersUnity from '@app/infrastructure/security/SecurityVoter/SecurityVotersUnity'
import TokenPayload from '@app/infrastructure/security/TokenPayload'

import DraftRequest from '../request/DraftRequest'
import DraftResponse from '../response/DraftResponse'
import JwtAuthGuard from '../security/JwtAuthGuard'
import CurrentUser from './decorator/CurrentUser'

@UseGuards(JwtAuthGuard)
@Controller('draft')
@ApiBearerAuth()
@ApiUseTags('draft')
export default class DraftController {
  public constructor(
    @InjectRepository(DraftRepository)
    private readonly draftRepo: DraftRepository,
    private readonly bus: CommandBus,
    private readonly votersUnity: SecurityVotersUnity,
  ) {}

  @Post('create')
  @ApiOperation({ title: 'Create the new draft' })
  @ApiOkResponse({ description: 'Created', type: DraftResponse })
  public async create(
    @Body() request: DraftRequest,
    @CurrentUser() user: TokenPayload,
  ): Promise<DraftResponse> {
    const { login } = user
    const { body } = request

    const draft: Draft = await this.bus.execute(
      new CreateDraftCommand(login, body),
    )

    return DraftResponse.fromEntity(draft)
  }

  @Post(':id/update')
  @HttpCode(200)
  @ApiOperation({ title: 'Update the existed draft' })
  @ApiOkResponse({ description: 'Updated', type: DraftResponse })
  public async update(
    @Param('id') id: string,
    @Body() request: DraftRequest,
    @CurrentUser() user: TokenPayload,
  ): Promise<DraftResponse> {
    const { body } = request

    const command = new EditDraftCommand(id, body)

    await this.votersUnity.denyAccessUnlessGranted(
      Attribute.Edit,
      command,
      user,
    )

    const draft: Draft = await this.bus.execute(command)

    return DraftResponse.fromEntity(draft)
  }

  @Get(':id')
  @ApiOperation({ title: 'Show the draft' })
  @ApiOkResponse({ description: 'Success', type: DraftResponse })
  @ApiNotFoundResponse({ description: 'Draft not found' })
  public async show(
    @Param('id') id: string,
    @CurrentUser() user: TokenPayload,
  ): Promise<DraftResponse> {
    const draft = await this.draftRepo.getOne(id)

    await this.votersUnity.denyAccessUnlessGranted(Attribute.Show, draft, user)

    return DraftResponse.fromEntity(draft)
  }
}
