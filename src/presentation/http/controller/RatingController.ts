import { Controller, Get, UseGuards, Post, Param, Body } from '@nestjs/common'
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiUseTags,
  ApiCreatedResponse,
} from '@nestjs/swagger'
import { InjectRepository } from '@nestjs/typeorm'

import JwtAuthGuard from '../security/JwtAuthGuard'
import CurrentUser from './decorator/CurrentUser'
import TokenPayload from '@app/infrastructure/security/TokenPayload'
import RatingAnswerRequest from '../request/RatingAnswerRequest'
import RatingRepository from '@app/domain/rating/RatingRepository'

@Controller('rating')
@UseGuards(JwtAuthGuard)
@ApiUseTags('rating')
@ApiBearerAuth()
export default class RatingController {
  public constructor(
    @InjectRepository(RatingRepository)
    private readonly ratingRepo: any,
  ) {}

  @Post('answer')
  @ApiOperation({ title: 'Add new answer' })
  @ApiOkResponse({ description: 'Success' })
  @ApiCreatedResponse({ description: 'Answer added' })
  public async addAnswer(
    @Param('id') claimId: string,
    @CurrentUser() user: TokenPayload,
    @Body() request: RatingAnswerRequest,
  ): Promise<any> {
    const { id, text } = request
  }
}
