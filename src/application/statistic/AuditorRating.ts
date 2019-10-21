import RatingRepository from '@app/domain/rating/RatingRepository'
import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'

@Injectable()
export class AuditorRating {
  constructor(
    @InjectRepository(RatingRepository)
    private readonly ratingRepo: RatingRepository,
  ) {}

  async getRatingValueQuestionsStat() {
    const valueQuestions = await this.ratingRepo.findAllValueQuestions()
    console.log('valueQuestions:', valueQuestions)
    return valueQuestions
  }
}
