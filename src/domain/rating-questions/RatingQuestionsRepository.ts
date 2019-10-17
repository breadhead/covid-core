import { AbstractRepository, EntityRepository } from 'typeorm'
import RatingQuestions from './RatingQuestions.entity'

@EntityRepository(RatingQuestions)
export default class RatingQuestionsRepository extends AbstractRepository<
  RatingQuestions
> {
  public findAll() {
    return this.repository.find()
  }
}
