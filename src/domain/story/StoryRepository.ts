import { AbstractRepository, EntityRepository } from 'typeorm'
import Story from './Story.entity'

@EntityRepository(Story)
export default class StoryRepository extends AbstractRepository<Story> {
  public findAll() {
    return this.repository.find()
  }

  public async getStories() {
    const stories = await this.repository.find()

    return stories.map(story => ({
      id: story.id,
      claimId: story._claimId,
      createdAt: story._createdAt,
      phone: story.phone,
      status: story.status,
    }))
  }
}
