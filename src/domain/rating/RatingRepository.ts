import { AbstractRepository, EntityRepository } from 'typeorm'
import Rating from './Rating.entity'

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
      .getMany()

    return valueQuestions
  }

  public async findAllCommentQuestions() {
    const commentQuestions = await this.repository
      .createQueryBuilder('rating')
      .where('rating._answerType like :type', {
        type: 'comment',
      })
      .getMany()

    return commentQuestions
  }

  async findAllClaimsWithFeedback() {
    const claimsWithFeedback = await this.repository
    .createQueryBuilder('rating')
    .leftJoinAndSelect('rating._claimId', 'claim')
    .leftJoinAndSelect('claim._doctor', 'doctor')
    .getMany()

    return claimsWithFeedback
  }
}
