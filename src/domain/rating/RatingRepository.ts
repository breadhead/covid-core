import { AbstractRepository, EntityRepository } from 'typeorm'
import Rating from './Rating.entity'

@EntityRepository(Rating)
export default class RatingRepository extends AbstractRepository<Rating> {
  public findAll() {
    return this.repository.find()
  }
}
