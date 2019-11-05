import { Controller, UseGuards, Post, Body, Get } from '@nestjs/common';
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
import RatingAnswerRequest from '../request/RatingAnswerRequest'
import RatingRepository from '@app/domain/rating/RatingRepository'
import RatingQuestionsRepository from '@app/domain/rating-questions/RatingQuestionsRepository'
import { EntityManager } from 'typeorm'
import Rating from '@app/domain/rating/Rating.entity'
import { IdGenerator } from '@app/utils/service/IdGenerator/IdGenerator'
import RatingQuestionResponse from '../response/RatingQuestionResponse'

@Controller('rating')
@UseGuards(JwtAuthGuard)
@ApiUseTags('rating')
@ApiBearerAuth()
export default class RatingController {
  public constructor(
    @InjectRepository(RatingRepository)
    private readonly ratingRepo: any,
    @InjectRepository(RatingQuestionsRepository)
    private readonly ratingQuestionsRepo: any,
    private readonly em: EntityManager,
    private readonly idGenerator: IdGenerator,
  ) { }

  @Post('answer')
  @ApiOperation({ title: 'Add new answer' })
  @ApiOkResponse({ description: 'Success' })
  @ApiCreatedResponse({ description: 'Answer added' })
  public async addAnswer(@Body() request: RatingAnswerRequest): Promise<any> {
    const { claimId, question, answerType, answerValue } = request

    const id = this.idGenerator.get()

    const curRating = new Rating(
      id,
      new Date(),
      claimId,
      question,
      answerType,
      answerValue,
    )

    await this.em.save(curRating)
  }

  @Get('questions')
  @ApiOperation({ title: 'Show list of rating questions' })
  @ApiOkResponse({
    description: 'Success',
    type: RatingQuestionResponse,
  })
  @ApiForbiddenResponse({
    description: 'Client API token doesnt provided',
  })
  public async getQuestions(): Promise<RatingQuestionResponse> {
    const questions = await this.ratingQuestionsRepo.findAll()

    return questions
  }
}
