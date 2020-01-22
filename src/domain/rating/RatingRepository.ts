import { AbstractRepository, EntityRepository } from 'typeorm'
import Rating from './Rating.entity'
import { startOfDay, endOfDay } from 'date-fns'

@EntityRepository(Rating)
export default class RatingRepository extends AbstractRepository<Rating> {
  public findAll() {
    return this.repository.find()
  }

  public async findAllValueQuestions() {
    const valueQuestions = await this.repository
      .createQueryBuilder('rating')
      .where('rating._answerType like :type', {
        type: 'value',
      })
      .leftJoinAndSelect('rating._questionId', 'question')
      .getMany()

    return valueQuestions
  }

  public async findAllCommentQuestions() {
    const commentQuestions = await this.repository
      .createQueryBuilder('rating')
      .leftJoinAndSelect('rating._questionId', 'question')
      .where('rating._answerType like :type', {
        type: 'comment',
      })
      .getMany()

    return commentQuestions
  }

  async findAllClaimsWithFeedback() {
    const claimsWithFeedback = await this.repository
      .createQueryBuilder('rating')
      .leftJoinAndSelect('rating._questionId', 'question')
      .leftJoinAndSelect('rating._claimId', 'claim')
      .leftJoinAndSelect('claim._doctor', 'doctor')
      .getMany()

    return claimsWithFeedback
  }

  public async findAllClaimsWithValueQuestionsByRange(from: Date, to: Date) {
    const start = startOfDay(from).toISOString()
    const end = endOfDay(to).toISOString()

    const valueQuestions = await this.repository
      .createQueryBuilder('rating')
      .where('rating._ratingDate >= :start', { start })
      .andWhere('rating._ratingDate <= :end', { end })
      .andWhere('rating._answerType like :type', {
        type: 'value',
      })
      .leftJoinAndSelect('rating._claimId', 'claim')
      .leftJoinAndSelect('claim._doctor', 'doctor')
      .getMany()

    return valueQuestions
  }

  public async findAllCommentQuestionsByRange(from: Date, to: Date) {
    const start = startOfDay(from).toISOString()
    const end = endOfDay(to).toISOString()

    const commentQuestions = await this.repository
      .createQueryBuilder('rating')
      .where('rating._answerType like :type', {
        type: 'comment',
      })
      .andWhere('rating._ratingDate >= :start', { start })
      .andWhere('rating._ratingDate <= :end', { end })
      .getMany()

    return commentQuestions
  }
}
