import RatingRepository from '@app/domain/rating/RatingRepository'
import { Injectable } from '@nestjs/common'

@Injectable()
export class AuditorRating {
  constructor(private readonly ratingRepo: RatingRepository) {}

  async getRatingValueQuestionsStat() {
    const valueQuestions = await this.ratingRepo.findAllValueQuestions()
    console.log('valueQuestions:', valueQuestions)
    return valueQuestions
  }
}
