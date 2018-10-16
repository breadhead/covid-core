import SecurityException from '../SecurityException'
import TokenPayload from '../TokenPayload'

export default class NoVotersException extends SecurityException {
  public constructor(token: TokenPayload) {
    super(token, 'Can\'t check permission by voters, all voters abstained')
  }
}
