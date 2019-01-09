export default class ActionUnavailableException extends Error {
  public readonly cause: string

  public constructor(name: string, cause: string = '') {
    super(`Action "${name}" unavailable`)

    this.cause = cause
  }
}
