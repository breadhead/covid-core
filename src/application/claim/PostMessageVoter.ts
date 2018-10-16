import SecurityVoter from '@app/infrastructure/security/SecurityVoter/SecurityVoter'
import TokenPayload from '@app/infrastructure/security/TokenPayload'

import PostMessageCommand from './PostMessageCommand'

export default class PostMessageVoter implements SecurityVoter<PostMessageCommand> {
  public supports(attribute: string, subject: PostMessageCommand) {
    return attribute === 'execute' && subject instanceof PostMessageCommand
  }

  public voteOnAttribute(attribute: string, subject: PostMessageCommand, token: TokenPayload): Promise<boolean> {
    console.log(attribute, subject, token)
    return Promise.resolve(true)
  }
}
