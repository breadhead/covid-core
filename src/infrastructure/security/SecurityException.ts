import TokenPayload from './TokenPayload'

export default class SecurityException extends Error {
  public readonly token: TokenPayload

  public constructor(
    token: TokenPayload,
    message: string = 'Stop right there criminal scum',
  ) {
    super(message)

    this.token = token
  }
}
