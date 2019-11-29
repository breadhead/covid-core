import RatingRepository from '@app/domain/rating/RatingRepository'
import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { groupBy } from 'lodash'
import { RatingValueAnswers } from './RatingValueAnswers'
import { ClaimsRatingDoctors } from './types/RatingDoctorsType'
import { RatingValueQuestion } from './RatingValueQuestion'

@Injectable()
export class AuditorRating {
  constructor(
    @InjectRepository(RatingRepository)
    private readonly ratingRepo: RatingRepository,
  ) { }

  async getRatingValueQuestionsStat(): Promise<RatingValueQuestion[]> {
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
        order: val[0].order as number,
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

    const groupedQuestions = groupBy(commentQuestions, '_questionId.id')

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
        average: this.getAverage(val),
        value: this.formatRatingDoctorAnswers(val, 'value'),
        // comment: this.formatRatingDoctorAnswers(val, 'comment'),
      }
    })

    return ratingDoctors

  }


  private formatRatingDoctorAnswers(answers: ClaimsRatingDoctors | any, type: string) {
    const filteredAnswers = answers.filter(item => item.questions.type === type)

    const arr = filteredAnswers.map(item => {
      return {
        id: item.questions.id.id,
        order: item.questions.id._order,
        value: item.questions.value
      }
    })
    const groupedArr = groupBy(arr, 'id')


    const res = Object.entries(groupedArr).map(([key, val]) => {
      const curAnswers = val.map(item => Number(item.value))

      const answersStat = Object.keys(RatingValueAnswers).map(answer => {
        const answerCount = curAnswers.filter(
          answ => answ === Number(answer)
        ).length

        return {
          [answer]: {
            count: answerCount,
            percentage: (
              (100 * answerCount) /
              curAnswers.length
            ).toFixed(2),
          },
        }
      })

      return {
        question: key,
        order: val[0].order,
        answers: answersStat
        // answers: type === 'value' ? this.getFormattedDoctorAnswers(groupedArr, item) : item.questions.value,
      }
    })

    const formattedAnswers = filteredAnswers.map((item) => {
      return {
        question: item.questions.id.id,
        order: item.questions.id._order,
        answers: type === 'value' ? this.getFormattedDoctorAnswers(groupedArr, item) : item.questions.value,
      }
    })

    return res
  }

  private getAverage(answers: ClaimsRatingDoctors | any) {
    const allValues = answers.filter(item => item.questions.type === 'value').map(item => Number(item.questions.value))
    return Math.round(allValues.reduce((acc, cur) => acc + cur, 0) / allValues.length)
  }

  private getFormattedDoctorAnswers(groupedArr: any, item: any) {

    const gradeAnswer = Object.keys(RatingValueAnswers).map(answer => {
      const curAnswers = groupedArr[item.questions.id.id].map(item => Number(item.value))

      const answerCount = curAnswers.filter(
        answ => answ === Number(answer),
      ).length

      return {
        [answer]: {
          count: answerCount,
          percentage: (
            (100 * answerCount) /
            curAnswers.length
          ).toFixed(2),
        },
      }
    })
    return gradeAnswer
  }
}
