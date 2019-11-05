import { Controller, UseGuards, Post, Body, Get } from '@nestjs/common'
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiUseTags,
  ApiCreatedResponse,
} from '@nestjs/swagger'
import { InjectRepository } from '@nestjs/typeorm'

import JwtAuthGuard from '../security/JwtAuthGuard'
import RatingRepository from '@app/domain/rating/RatingRepository'
import RatingQuestionsRepository from '@app/domain/rating-questions/RatingQuestionsRepository'
import { EntityManager } from 'typeorm'
import { IdGenerator } from '@app/utils/service/IdGenerator/IdGenerator'
import StoryAddPhoneRequest from '../request/StoryAddPhoneRequest'
import Story from '@app/domain/story/Story.entity'

@Controller('story')
@UseGuards(JwtAuthGuard)
@ApiUseTags('story')
@ApiBearerAuth()
export default class StoryController {
  public constructor(
    @InjectRepository(RatingRepository)
    private readonly ratingRepo: any,
    @InjectRepository(RatingQuestionsRepository)
    private readonly ratingQuestionsRepo: any,
    private readonly em: EntityManager,
    private readonly idGenerator: IdGenerator,
  ) {}

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
