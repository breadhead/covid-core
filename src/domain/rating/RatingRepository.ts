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
}
