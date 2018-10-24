import { CommandBus } from '@breadhead/nest-throwable-bus/dist'
import { Body, Controller, Post } from '@nestjs/common'
import { ApiCreatedResponse, ApiOperation, ApiUseTags } from '@nestjs/swagger'

import PostFeedbackCommand from '@app/application/feedback/PostFeedbackCommand'
import Feedback from '@app/domain/feedback/Feedback.entity'

import FeedbackRequest from '../request/FeedbackRequest'
import FeedbackResponse from '../response/FeedbackResponse'

@Controller('feedback')
@ApiUseTags('feedback')
export default class FeedbackController {
  public constructor(
    private readonly bus: CommandBus,
  ) { }

  @Post('send')
  @ApiOperation({ title: 'Send feedback' })
  @ApiCreatedResponse({ description: 'Success', type: FeedbackResponse })
  public async sendFeedback(@Body() request: FeedbackRequest): Promise<FeedbackResponse> {
    const command = new PostFeedbackCommand(
      request.name,
      request.content,
      request.email,
      request.phone,
      request.theme,
    )

    const feedback: Feedback = await this.bus.execute(command)

    return {
      status: true,
    } as FeedbackResponse
  }
}
