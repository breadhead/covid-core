import RatingRepository from '@app/domain/rating/RatingRepository'
import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { groupBy } from 'lodash'
import { RatingValueAnswers } from './RatingValueAnswers'
import { fromQuestionIdToNum } from './helpers/fromQuestionIdToNum'
import { ClaimRepository } from '@app/domain/claim/ClaimRepository'

@Injectable()
export class AuditorRating {
  constructor(
    @InjectRepository(RatingRepository)
    private readonly ratingRepo: RatingRepository,
  ) { }

  async getRatingValueQuestionsStat() {
    const valueQuestions = await this.ratingRepo.findAllValueQuestions()


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


    const claims = claimsWithFeedback.map((claim) => {
      return {
        doctor: claim._claimId._doctor.fullName,
        question: {
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
        value: val.filter(item => item.question.type === 'value').map((item) => {
          return {
            id: item.question.id,
            value: item.question.value
          }
        }),
        comment: val.filter(item => item.question.type === 'comment').map((item) => {
          return {
            id: item.question.id,
            value: item.question.value
          }
        })
      }
    })

    return ratingDoctors
  }
}
