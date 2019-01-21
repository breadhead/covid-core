export default class SignUpException extends Error {
  public readonly fields: any

  public constructor(fields: any, message: string) {
    super(message)

    this.fields = fields
  }
}
