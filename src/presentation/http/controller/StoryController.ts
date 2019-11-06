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
import { StoryService } from '@app/domain/story/StoryService'
import { ClaimRepository } from '@app/domain/claim/ClaimRepository'

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
  public async getStories(): Promise<StoryResponse> {
    const stories = await this.storyService.getStories()

    return stories as any
  }

  @Post('add-phone')
  @ApiOperation({ title: 'Add new phone' })
  @ApiOkResponse({ description: 'Success' })
  @ApiCreatedResponse({ description: 'Phone added' })
  public async addPhone(@Body() request: StoryAddPhoneRequest): Promise<any> {
    const { claimId, phone, status } = request

    const id = this.idGenerator.get()

    const number = await this.claimRepo.getNumberById(claimId)

    const curStory = new Story(id, new Date(), claimId, number, phone, status)

    await this.em.save(curStory)
  }
}
