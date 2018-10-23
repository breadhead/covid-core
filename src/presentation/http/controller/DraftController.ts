import { CommandBus } from '@breadhead/nest-throwable-bus'
import { Body, Controller, Get, HttpCode, Param, Post, UseGuards } from '@nestjs/common'
import { ApiBearerAuth, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiUseTags } from '@nestjs/swagger'
import { InjectRepository } from '@nestjs/typeorm'

import CreateDraftCommand from '@app/application/draft/CreateDraftCommand'
import Draft from '@app/domain/draft/Draft.entity'
import DraftRepository from '@app/domain/draft/DraftRepository'
import TokenPayload from '@app/infrastructure/security/TokenPayload'

import CurrentUser from '../request/CurrentUser'
import DraftRequest from '../request/DraftRequest'
import DraftResponse from '../response/DraftResponse'
import JwtAuthGuard from '../security/JwtAuthGuard'

@UseGuards(JwtAuthGuard)
@Controller('draft')
@ApiBearerAuth()
@ApiUseTags('draft')
export default class DraftController {

  public constructor(
    @InjectRepository(DraftRepository) private readonly draftRepo: DraftRepository,
    private readonly bus: CommandBus,
  ) { }

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
    @Body() draft: DraftRequest,
  ): Promise<DraftResponse> {
    return {
      id,
      body: '',
    }
  }

  @Get(':id')
  @ApiOperation({ title: 'Show the draft' })
  @ApiOkResponse({ description: 'Success', type: DraftResponse })
  @ApiNotFoundResponse({ description: 'Draft not found' })
  public async show(@Param('id') id: string): Promise<DraftResponse> {
    const draft = await this.draftRepo.getOne(id)

    return DraftResponse.fromEntity(draft)
  }
}
