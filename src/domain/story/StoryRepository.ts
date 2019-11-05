import { AbstractRepository, EntityRepository } from 'typeorm'
import Story from './Story.entity'

@EntityRepository(Story)
export default class StoryRepository extends AbstractRepository<Story> {
  public findAll() {
    return this.repository.find()
  }
}
