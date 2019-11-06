import { AbstractRepository, EntityRepository } from 'typeorm'
import Story from './Story.entity'

@EntityRepository(Story)
export default class StoryRepository extends AbstractRepository<Story> {
  public async findAll() {
    const stories = await this.repository.find()

    return stories
  }

  public async findById(id: string) {
    const story = await this.repository.findOne(id)

    return story
  }
}
