import RatingRepository from '@app/domain/rating/RatingRepository'
import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { groupBy } from 'lodash'
import { RatingValueAnswers } from './RatingValueAnswers'
import { fromQuestionIdToNum } from './helpers/fromQuestionIdToNum'

@Injectable()
export class AuditorRating {
  constructor(
    @InjectRepository(RatingRepository)
    private readonly ratingRepo: RatingRepository,
  ) {}

  async getRatingValueQuestionsStat() {
    const valueQuestions = await this.ratingRepo
      .findAllValueQuestions()
      .then(val =>
        val.sort(
          (a, b) =>
            fromQuestionIdToNum(a._questionId) -
            fromQuestionIdToNum(b._questionId),
        ),
      )

    const groupedQuestions = groupBy(valueQuestions, '_questionId')

    const ratingValueQuestions = Object.keys(groupedQuestions).map(key => ({
      [key]: Object.keys(RatingValueAnswers).map(answer => {
        const answerCount = groupedQuestions[key].filter(
          answ => answ._answerValue === answer,
        ).length

        return {
          [answer]: {
            count: answerCount,
            percentage: (
              (100 * answerCount) /
              groupedQuestions[key].length
            ).toFixed(2),
          },
        }
      }),
    }))

    return ratingValueQuestions
  }
}
