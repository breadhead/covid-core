export class VerificationFailedException extends Error {
  public readonly code: string

  public constructor(code: string) {
    super('Incorrect verification code')

    this.code = code
  }
}
