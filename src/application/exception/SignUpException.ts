export default class SignUpException extends Error {
  public readonly fields: any
  public readonly code: number

  public constructor(fields: any, message: string, code?: number) {
    super(message)

    this.fields = fields
    this.code = code
  }
}
