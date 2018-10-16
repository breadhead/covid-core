import TokenPayload from './TokenPayload'

export default class SecurityException extends Error {
  private readonly token: TokenPayload

  public constructor(token: TokenPayload) {
    super('Stop right there criminal scum')

    this.token = token
  }
}
