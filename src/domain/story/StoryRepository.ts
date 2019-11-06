import { AbstractRepository, EntityRepository } from 'typeorm'
import Story from './Story.entity'
import Claim from '../claim/Claim.entity'

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

  public async findAllStoriesWithClaims(): Promise<
    (Story & { claim: Claim })[]
  > {
    return this.repository
      .createQueryBuilder('story')
      .leftJoinAndSelect('story.claim', 'claim')
      .getMany()
  }
}
