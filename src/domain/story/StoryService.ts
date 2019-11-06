import { Injectable } from '@nestjs/common'

import StoryRepository from '@app/domain/story/StoryRepository'
import { InjectRepository } from '@nestjs/typeorm'

@Injectable()
export class StoryService {
  constructor(
    @InjectRepository(StoryRepository)
    private readonly storyRepo: StoryRepository,
  ) {}

  async getStories() {
    const stories = await this.storyRepo.findAll()

    return stories.map(story => ({
      id: story.id,
      claimId: story._claimId,
      number: story.number,
      createdAt: story._createdAt,
      phone: story.phone,
      status: story.status,
    }))
  }
}
