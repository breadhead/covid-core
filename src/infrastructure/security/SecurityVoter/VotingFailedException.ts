import SecurityException from '../SecurityException'
import TokenPayload from '../TokenPayload'

export default class VotingFailedException extends SecurityException {
  public constructor(token: TokenPayload) {
    super(token, 'Permission denied')
  }
}
