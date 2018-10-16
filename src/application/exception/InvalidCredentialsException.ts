export default class InvalidCredentialsException extends Error {
  public readonly credentials: any

  public constructor(credentials: any) {
    super('Invalid credentials')

    this.credentials = credentials
  }
}
