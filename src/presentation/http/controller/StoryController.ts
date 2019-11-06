import { Controller, UseGuards, Post, Body, Get } from '@nestjs/common'
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiUseTags,
  ApiCreatedResponse,
  ApiForbiddenResponse,
} from '@nestjs/swagger'

import JwtAuthGuard from '../security/JwtAuthGuard'
import { EntityManager } from 'typeorm'
import { IdGenerator } from '@app/utils/service/IdGenerator/IdGenerator'
import StoryAddPhoneRequest from '../request/StoryAddPhoneRequest'
import Story from '@app/domain/story/Story.entity'
import StoryResponse from '../response/StoryResponse'
import { StoryService } from '@app/domain/story/StoryService'
import { ClaimRepository } from '@app/domain/claim/ClaimRepository'
import StoryRepository from '@app/domain/story/StoryRepository'
import { InjectRepository } from '@nestjs/typeorm'
import StoryUpdateStatusRequest from '../request/StoryUpdateStatusRequest'

@Controller('story')
@UseGuards(JwtAuthGuard)
@ApiUseTags('story')
@ApiBearerAuth()
export default class StoryController {
  public constructor(
    private readonly storyService: StoryService,
    private readonly em: EntityManager,
    private readonly idGenerator: IdGenerator,
    private readonly claimRepo: ClaimRepository,
    @InjectRepository(StoryRepository)
    private readonly storyRepo: StoryRepository,
  ) {}

  @Get('')
  @ApiOperation({ title: 'Show list of users who want to tell a story' })
  @ApiOkResponse({
    description: 'Success',
    type: StoryResponse,
  })
  @ApiForbiddenResponse({
    description: 'Client API token doesnt provided',
  })
  public async getStories(): Promise<StoryResponse> {
    const stories = await this.storyService.getStories()

    return stories as any
  }

  @Post('add-phone')
  @ApiOperation({ title: 'Add new phone' })
  @ApiOkResponse({ description: 'Success' })
  @ApiCreatedResponse({ description: 'Phone added' })
  public async addPhone(@Body() request: any): Promise<any> {
    const { phone, status, claimId } = request

    const id = this.idGenerator.get()

    const claim = await this.claimRepo.getOne(claimId)

    const curStory = new Story(id, new Date(), claim, phone, status)

    await this.em.save(curStory)
  }

  @Post('update-status')
  @ApiOperation({ title: 'Update status' })
  @ApiOkResponse({ description: 'Success' })
  @ApiCreatedResponse({ description: 'Status updated' })
  public async updateStatus(
    @Body() request: StoryUpdateStatusRequest,
  ): Promise<any> {
    const { id, status } = request

    const story = await this.storyRepo.findById(id)
    story.updateStatus(status)
    await this.em.save(story)
  }
}
