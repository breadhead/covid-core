export default class SmsException extends Error {
  public readonly link: string
  public readonly error: string

  public constructor(error: string, link: string) {
    super(`Error in shortening the link ${link}: ${error}`)

    this.link = link
    this.error = error
  }
}
