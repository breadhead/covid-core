import RatingRepository from '@app/domain/rating/RatingRepository'
import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { groupBy } from 'lodash'
import { RatingValueAnswers } from './RatingValueAnswers'
import { ClaimsRatingDoctors } from './types/RatingDoctorsType'

@Injectable()
export class AuditorRating {
  constructor(
    @InjectRepository(RatingRepository)
    private readonly ratingRepo: RatingRepository,
  ) { }

  async getRatingValueQuestionsStat() {
    const valueQuestions = await this.ratingRepo.findAllValueQuestions()

    const mappedQuestions = valueQuestions.map(item => {
      return {
        question: (item._questionId as any).id,
        order: (item._questionId as any)._order,
        rest: item
      }
    })

    const group = groupBy(mappedQuestions, 'question')

    const ratingValueQuestions = Object.entries(group).map(([key, val]) => {
      const answers = val.map(item => item.rest)
      return {
        question: key,
        order: val[0].order,
        answers: Object.keys(RatingValueAnswers).map(answer => {
          const answerCount = answers.filter(
            answ => answ._answerValue === answer,
          ).length

          return {
            [answer]: {
              count: answerCount,
              percentage: (
                (100 * answerCount) /
                group[key].length
              ).toFixed(2),
            },
          }
        }),
      }
    })

    return ratingValueQuestions
  }

  async getRatingCommentQuestionsStat() {
    const commentQuestions = await this.ratingRepo.findAllCommentQuestions()

    const groupedQuestions = groupBy(commentQuestions, '_questionId')

    const ratingCommentQuestions = Object.entries(groupedQuestions).map(
      ([key, val]) => {
        return {
          [key]: val.map(item => item._answerValue),
        }
      },
    )

    return ratingCommentQuestions
  }

  async getRatingDoctors() {
    const claimsWithFeedback = await this.ratingRepo.findAllClaimsWithFeedback() as any


    const claims: ClaimsRatingDoctors = claimsWithFeedback.map((claim) => {
      return {
        doctor: claim._claimId._doctor.fullName,
        questions: {
          id: claim._questionId,
          type: claim._answerType,
          value: claim._answerValue
        }
      }
    })

    const groupedClaims = groupBy(claims, 'doctor')

    const ratingDoctors = Object.entries(groupedClaims).map(([key, val]) => {
      return {
        doctor: key,
        value: this.formatRatingDoctorAnswers(val, 'value'),
        comment: this.formatRatingDoctorAnswers(val, 'comment'),
        average: this.getAverage(val)
      }
    })

    return ratingDoctors

  }

  private formatRatingDoctorAnswers(answers: ClaimsRatingDoctors | any, type: string) {
    const formattedAnswers = answers.filter(item => item.questions.type === type).map((item) => {
      return {
        id: item.questions.id,
        [type]: item.questions.value,
      }
    })
    return formattedAnswers
  }

  private getAverage(answers: ClaimsRatingDoctors | any) {
    const allValues = answers.filter(item => item.questions.type === 'value').map(item => Number(item.questions.value))
    return Math.round(allValues.reduce((acc, cur) => acc + cur, 0) / allValues.length)
  }
}
