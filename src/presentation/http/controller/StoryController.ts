import { Controller, UseGuards, Post, Body, Get } from '@nestjs/common'
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiUseTags,
  ApiCreatedResponse,
  ApiForbiddenResponse,
} from '@nestjs/swagger'
import { InjectRepository } from '@nestjs/typeorm'

import JwtAuthGuard from '../security/JwtAuthGuard'
import { EntityManager } from 'typeorm'
import { IdGenerator } from '@app/utils/service/IdGenerator/IdGenerator'
import StoryAddPhoneRequest from '../request/StoryAddPhoneRequest'
import Story from '@app/domain/story/Story.entity'
import StoryResponse from '../response/StoryResponse'
import StoryRepository from '@app/domain/story/StoryRepository'

@Controller('story')
@UseGuards(JwtAuthGuard)
@ApiUseTags('story')
@ApiBearerAuth()
export default class StoryController {
  public constructor(
    @InjectRepository(StoryRepository)
    private readonly storyRepo: StoryRepository,
    private readonly em: EntityManager,
    private readonly idGenerator: IdGenerator,
  ) {}

  @Get('')
  @ApiOperation({ title: 'Show list of rating questions' })
  @ApiOkResponse({
    description: 'Success',
    type: StoryResponse,
  })
  @ApiForbiddenResponse({
    description: 'Client API token doesnt provided',
  })
  public async getQuestions(): Promise<StoryResponse> {
    const stories = await this.storyRepo.getStories()

    return stories as any
  }

  @Post('add-phone')
  @ApiOperation({ title: 'Add new phone' })
  @ApiOkResponse({ description: 'Success' })
  @ApiCreatedResponse({ description: 'Phone added' })
  public async addPhone(@Body() request: StoryAddPhoneRequest): Promise<any> {
    const { claimId, phone, status } = request

    const id = this.idGenerator.get()

    const curStory = new Story(id, new Date(), claimId, phone, status)

    await this.em.save(curStory)
  }
}
