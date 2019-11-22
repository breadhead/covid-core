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
    const stories = await this.storyRepo.findAllStoriesWithClaims()

    return stories.map(story => ({
      id: story.id,
      createdAt: story._createdAt,
      claimId: story.claim.id,
      number: story.claim.number,
      phone: story.phone,
      status: story.status,
      name: story.claim.applicant.name,
    }))
  }
}
